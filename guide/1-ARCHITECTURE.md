# 1. System Architecture

The Hubbard System Health Dashboard operates on a modern, secure 3-tier architecture. This design is crucial for safely interacting with the legacy Hubbard system, ensuring that the core application remains isolated and protected.

### The Three Tiers

1.  **React Frontend (This Project):**
    *   **What it is:** A modern, responsive web application built with React and TypeScript.
    *   **Purpose:** Provides the user interface for monitoring and management. It is designed to be self-hosted on a separate server (e.g., a Linux machine running Docker) for security and scalability.
    *   **Communication:** It **only** communicates with the Backend API. It never directly contacts the Hubbard server.

2.  **Backend API (Node.js/Express - *Separate Project*):**
    *   **What it is:** A lightweight backend service that serves the React application and exposes a secure REST API.
    *   **Purpose:** Acts as a middleman or "proxy." It authenticates and authorizes requests from the UI and then forwards valid commands to the Hubbard Windows Agent. This prevents direct exposure of the Windows Agent to the users.
    *   **Communication:** It listens for requests from the Frontend and sends commands to the Windows Agent over a secure, internal network connection.

3.  **Hubbard Windows Agent (.NET/PowerShell - *Separate Project*):**
    *   **What it is:** A small, secure service that must be installed directly on the Windows server where the Hubbard system resides.
    *   **Purpose:** Its sole responsibility is to execute commands locally, read log files, and gather system metrics. It is the only component that directly touches the Hubbard system.
    *   **Communication:** It exposes a local API that **only** the Backend API can access. It should be firewalled from all other traffic.

### Communication Flow Diagram

```
[User's Browser] <--> [React Frontend] <--> [Backend API] <--> [Hubbard Windows Agent] <--> [Hubbard System]
      |                      |                      |                       |
   Internet            Separate Server      Internal Network        Windows Server
```

### Why This Architecture?

*   **Security:** The legacy Hubbard system is never exposed to the internet. All access is funneled through two layers of protection (Backend API and Agent).
*   **Separation of Concerns:** Each tier has a single job. The frontend handles presentation, the backend handles business logic and security, and the agent handles direct system interaction. This makes the system easier to develop, maintain, and debug.
*   **Modernization:** It allows for a modern, user-friendly interface to be built on top of a legacy system without modifying the legacy system itself.
