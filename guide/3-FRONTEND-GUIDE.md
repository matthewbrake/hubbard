# 3. Frontend Development & Deployment Guide

This document provides all necessary instructions for setting up, configuring, running, and deploying the Hubbard Dashboard frontend application.

---

## Setup Instructions

### 1. Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)

### 2. Install Dependencies

Navigate to the project's root directory and install the required packages using npm:

```bash
npm install
```

---

## Running the Application

### Running the Development Server

You can run the development server using the `start` or `dev` script:

```bash
npm start
```
This will start the Vite development server, typically on `http://localhost:5173`.

### Running on a Different Port

To specify a different port, use the `--port` flag with the `start` or `dev` command:

```bash
npm start -- --port 8080
```
The application will now be available at `http://localhost:8080`.

### Production Build

To create an optimized build for deployment:
```bash
npm run build
```
This creates a `dist` directory with static assets ready to be served.

---

## Configuration

The frontend is configured via environment variables. For local development, you can create a `.env` file in the project root. This file is **not** committed to version control.

**Example `.env` file:**

```
# The full URL to your Backend API service
REACT_APP_HUBBARD_AGENT_URL=http://localhost:4000/api/hubbard

# A secret API key for authenticating with your backend service
REACT_APP_HUBBARD_AGENT_API_KEY=your-secret-development-key
```

For a production deployment (like with Docker), these variables should be passed into the environment where the application is running.

---

## Self-Hosting & Deployment

Once you have run `npm run build`, you have a `dist` folder containing all the static files for the application. Here are two ways to deploy it.

### Method 1: Simple Static Server (for testing/internal use)

You can use a simple package like `serve` to host the files.

1.  **Build the application:**
    ```bash
    npm run build
    ```

2.  **Serve the `dist` directory:**
    ```bash
    npx serve dist
    ```
    This will start a web server and give you a URL (e.g., `http://localhost:3000`) where you can access the dashboard.

### Method 2: Production Deployment with Docker (Recommended)

Using Docker is a robust and repeatable way to deploy the application. A `Dockerfile` is included in the project.

1.  **Prerequisite:** Make sure you have Docker installed and running on your server.

2.  **Build the Docker Image:**
    From the root directory of the project, run the following command. This will build your application and package it into a lightweight Nginx web server image.
    ```bash
    docker build -t hubbard-dashboard .
    ```

3.  **Run the Docker Container:**
    Now, run the image you just built. This command will start the dashboard and make it accessible on port 8080 of your server.
    ```bash
    docker run -d -p 8080:80 --name hubbard-dashboard-container hubbard-dashboard
    ```
    *   `-d`: Runs the container in detached mode (in the background).
    *   `-p 8080:80`: Maps port 8080 on your host machine to port 80 inside the container. You can change `8080` to any port you prefer.
    *   `--name ...`: Gives your running container a memorable name.

You can now access your Hubbard Dashboard by navigating to `http://<your_server_ip>:8080` in your web browser.
