# Hubbard System Health Dashboard

## Overview

The Hubbard System Health Dashboard is a modern, web-based interface designed to monitor and manage a legacy Hubbard system, which is typically a COBOL-based application running on a Windows server. Given the sensitive and critical nature of the Hubbard application, this dashboard provides a safe, read-only-first interface with secure, controlled actions to ensure system stability and provide clear visibility into its operations.

## Architecture

This dashboard is the frontend part of a 3-tier architecture designed for security, performance, and separation of concerns.

1.  **React Frontend (This Project):** A modern, responsive web application built with React and TypeScript. It provides the user interface and is designed to be self-hosted on a separate server (e.g., a Linux machine running Docker) for security and scalability. It communicates with the Backend API.

2.  **Backend API (Node.js/Express - Separate Project):** A lightweight backend service that serves the React application and exposes a secure REST API. It acts as a middleman, authenticating and forwarding requests from the UI to the Hubbard Windows Agent. This prevents direct exposure of the Windows Agent to the public internet.

3.  **Hubbard Windows Agent (.NET/PowerShell - Separate Project):** A small, secure service that must be installed directly on the Windows server where the Hubbard system resides. Its sole responsibility is to execute commands locally, read log files, and gather system metrics. It exposes a local API that only the Backend API can access.

 *(Conceptual Diagram Link)*

This separation ensures that the core Hubbard system remains isolated and secure, with all interactions managed and audited through a controlled API layer.

---

## Features

-   **Dashboard Overview:** At-a-glance view of server status, active sessions, and job health.
-   **Session Manager:** View all active `AcuServer` user sessions, including PID, user, and locked files. Provides a secure way to terminate "ghost" or stuck sessions.
-   **Maintenance Tools:** Safely run Hubbard utilities like `vutil32.exe` to check file integrity and rebuild indexes, with command output streamed to the UI.
-   **Performance Monitoring:** Real-time charts for CPU, memory usage, and system latency.
-   **Log Viewer:** A centralized and easy-to-read stream of system logs.

---

## Setup and Self-Hosting

Follow these steps to set up and run the dashboard frontend.

### Prerequisites

-   Git
-   Node.js (v18 or later)
-   npm or yarn
-   Docker (for containerized deployment)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hubbard-dashboard
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, edit the `.env` file with the appropriate values for your environment.

| Variable                  | Description                                                                                             | Example                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `REACT_APP_HUBBARD_AGENT_URL` | The full URL to your Backend API service which proxies requests to the Windows Agent.                   | `http://api.internal:4000/api/hubbard` |
| `REACT_APP_HUBBARD_AGENT_API_KEY` | A secret API key for authenticating with your backend service.                                            | `a-very-secret-key`                     |

**Note:** The `.env` file contains sensitive information. Ensure it is included in your `.gitignore` file and never committed to version control.

### 3. Install Dependencies

```bash
npm install
```

### 4. Running the Application

-   **Development Mode:**
    ```bash
    npm start
    ```
    This will start the React development server, typically on `http://localhost:3000`.

-   **Production Build:**
    ```bash
    npm run build
    ```
    This creates a `build` directory with optimized, static assets ready for deployment.

### 5. Deployment with Docker (Recommended)

A `Dockerfile` is included for easy containerization.

1.  **Build the Docker image:**
    ```bash
    docker build -t hubbard-dashboard .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -p 8080:80 \
      -e REACT_APP_HUBBARD_AGENT_URL="http://api.internal:4000/api/hubbard" \
      -e REACT_APP_HUBBARD_AGENT_API_KEY="your-production-secret-key" \
      --name hubbard-ui \
      -d hubbard-dashboard
    ```
    The dashboard will now be accessible at `http://localhost:8080`.
