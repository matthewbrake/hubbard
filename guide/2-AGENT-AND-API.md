# 2. Backend API & Windows Agent Guide

This document outlines the responsibilities of the two backend components: the **Backend API** and the **Hubbard Windows Agent**. It describes how the agent should source its data from the Hubbard system.

## Backend API Responsibilities

The Backend API is the central hub for logic and security.

*   **Authentication:** It validates API keys from the frontend to ensure requests are legitimate.
*   **Request Validation:** It sanitizes and validates all incoming requests before forwarding them to the agent. For example, it should ensure a PID for termination is a valid number.
*   **Proxying:** It forwards validated requests to the Hubbard Windows Agent.
*   **Logging:** It should maintain detailed logs of all actions performed, including which user (or API key) initiated the action, the action performed, and the result. This creates a critical audit trail.

## Windows Agent: Data Sourcing & Command Execution

The agent is the "hands" of the system, running directly on the Hubbard server. All file paths and settings should be configurable via an environment file on the agent's host.

### Session Management (`/sessions`)

*   **Data Source:** The `AcuServer` service.
*   **Get Sessions:**
    1.  The agent executes `sc queryex "AcuServer XXXX"` for each port in the configured range (e.g., 6000-6100) to get the Process ID (PID) of the service instance.
    2.  It uses Windows utilities (like `netstat -aon`) to correlate PIDs with users.
    3.  It inspects open file handles for each PID within the configured data path (`D:\JHA\lcs_data`) to identify locked files.
    4.  It returns a JSON array of `HubbardSession` objects.
*   **Kill Session:**
    1.  The agent receives a PID to terminate from the Backend API.
    2.  It executes `taskkill /PID {pid} /F`.
    3.  It returns a success or failure message.

### System Maintenance (`/maintenance`)

*   **Data Source:** The `vutil32.exe` utility.
*   **File Integrity Check:**
    *   The agent executes: `{HUBBARD_BIN_PATH}\vutil32.exe -check {HUBBARD_DATA_PATH}\*.dat`
    *   It must capture the `stdout` and `stderr` streams and return them as plain text.
*   **Index Rebuild:**
    *   The agent executes: `{HUBBARD_BIN_PATH}\vutil32.exe -rebuild -a {filePath}`
    *   It captures and returns the output streams.

### Performance Metrics (`/metrics`)

*   **Data Source:** Windows Performance Counters (WMI or PowerShell).
*   **Agent Actions:** The agent periodically queries the OS for:
    *   **CPU:** `(Get-CimInstance Win32_Processor).LoadPercentage`
    *   **Memory:** `(Get-CimInstance Win32_OperatingSystem) | Select FreePhysicalMemory, TotalVisibleMemorySize`
    *   **Latency:** The agent can measure the response time of its own endpoint to provide a basic latency metric.
    *   This data is packaged into a `ServerMetrics` JSON object.

### Log Viewing (`/logs`)

*   **Data Source:** Hubbard application log file.
*   **Agent Actions:**
    1.  The agent "tails" the log file specified by `HUBBARD_LOG_FILE_PATH`.
    2.  It parses new lines into a structured `LogEntry` format (`{timestamp, level, message}`).
    3.  For a real-time stream, this endpoint is ideally handled via WebSockets. For a simpler REST implementation, it can return the last N lines of the log file.

### Agent Logging

The agent itself should have configurable log levels (`DEBUG`, `INFO`, `WARN`, `ERROR`) to assist with troubleshooting its own operations.
