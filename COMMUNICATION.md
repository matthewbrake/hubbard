# Hubbard Dashboard Communication Flow

This document outlines how the frontend components of the Hubbard Dashboard communicate with the conceptual backend services to retrieve data and perform actions on the Hubbard system.

## High-Level Architecture

The data flows through several layers to ensure security and maintainability:

**[React Component] → [React Hook] → [API Service] → [Backend API] → [Hubbard Windows Agent] → [Hubbard System]**

-   **React Component:** Renders the UI (e.g., `SessionManagerView`).
-   **React Hook:** Manages state for a specific data type (e.g., `useHubbardSessions`).
-   **API Service (`hubbardApiService.ts`):** Makes the actual HTTP requests to the backend. Currently mocked for demonstration.
-   **Backend API:** A server application (e.g., Node.js) that handles business logic and forwards requests to the agent.
-   **Hubbard Windows Agent:** A service on the Windows server that executes local commands and reads files.

---

## Data Sourcing and Command Execution

This section details how the Windows Agent would acquire the data requested by the frontend. Configuration values mentioned (e.g., `HUBBARD_BIN_PATH`) are set in the `.env` file and used by the agent.

### 1. Session Management (`SessionManagerView`)

-   **Data Source:** Active sessions are managed by the `AcuServer` service on the Windows host.
-   **Agent Actions:**
    1.  **List Sessions:** The agent periodically scans the port range defined by `HUBBARD_PORT_RANGE_START` and `HUBBARD_PORT_RANGE_END`.
    2.  For each active port, it runs `sc queryex "AcuServer XXXX"` (where XXXX is the port number) to get the Process ID (PID).
    3.  It correlates the PID with user sessions and checks for file locks by inspecting open file handles within the `HUBBARD_DATA_PATH`.
    4.  It returns a list of `HubbardSession` objects.
-   **Kill Session Action:**
    1.  The UI sends a request to terminate a session by its PID.
    2.  The Backend API validates the request.
    3.  The agent receives the PID and executes `taskkill /PID {pid} /F` on the Windows server.
    4.  It returns a success or failure message.

### 2. System Maintenance (`MaintenanceView`)

-   **Data Source:** The `vutil32.exe` utility located in `HUBBARD_BIN_PATH`.
-   **Agent Actions:**
    1.  **File Integrity Check:** The agent executes the command:
        ```cmd
        {HUBBARD_BIN_PATH}\vutil32.exe -check {HUBBARD_DATA_PATH}\*.dat
        ```
    2.  **Index Rebuild:** The agent executes:
        ```cmd
        {HUBBARD_BIN_PATH}\vutil32.exe -rebuild -a {filePath}
        ```
        The agent captures the `stdout` and `stderr` from these commands and streams the output back to the frontend.

### 3. Performance Metrics (`PerformanceView`)

-   **Data Source:** Windows Performance Counters.
-   **Agent Actions:** The agent uses native Windows commands or libraries (e.g., PowerShell's `Get-Counter` or WMI queries) to get real-time system metrics:
    -   **CPU:** `wmic cpu get loadpercentage`
    -   **Memory:** `wmic os get freephysicalmemory, totalvisiblememorysize`
    -   **Latency:** The agent can ping a critical internal resource or measure its own API response time.
    -   This data is collected periodically and sent to the frontend.

### 4. Log Viewing (`LogView`)

-   **Data Source:** The central Hubbard application log file. The location is specified by `HUBBARD_LOG_FILE_PATH`.
-   **Agent Actions:**
    1.  The agent "tails" the log file specified in the configuration.
    2.  It watches for new entries and parses them into a structured `LogEntry` format (`{timestamp, level, message}`).
    3.  This data is streamed to the frontend, typically via WebSockets, to provide a real-time log view.
