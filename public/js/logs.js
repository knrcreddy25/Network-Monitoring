const eventLogs = [
    {
        time: "10:48:32 AM",
        severity: "critical",
        device: "CoreRouter-A1",
        message: "High CPU Usage (94%)",
        duration: "10m 14s"
    },
    {
        time: "10:45:22 AM",
        severity: "warning",
        device: "WebServer-04",
        message: "Connection Timeout",
        duration: "5m 20s"
    },
    {
        time: "10:42:05 AM",
        severity: "warning",
        device: "CoreRouter-A1",
        message: "Packet Loss Spike",
        duration: "3m 45s"
    },
    {
        time: "10:39:17 AM",
        severity: "info",
        device: "AppServer-02",
        message: "Network Scan Completed",
        duration: "1m 03s"
    },
    {
        time: "10:33:44 AM",
        severity: "critical",
        device: "DB-Server-01",
        message: "Database Port Unreachable",
        duration: "8m 11s"
    }
];

const historyLogs = [
    {
        timestamp: "10/26/23 10:26:43",
        severity: "critical",
        source: "NetworkSwitch-03",
        action: "Port Failure",
        user: "System",
        description: "Port GigabitEthernet1/0/22 link down."
    },
    {
        timestamp: "10/26/23 10:15:02",
        severity: "error",
        source: "DB-Server-01",
        action: "Query Slowdown",
        user: "N/A",
        description: "Select query executed in 12.5s."
    },
    {
        timestamp: "10/25/23 18:42:10",
        severity: "info",
        source: "AppServer-02",
        action: "Service Restart",
        user: "Admin",
        description: "Nginx service restarted successfully."
    },
    {
        timestamp: "10/25/23 10:24:23",
        severity: "info",
        source: "NetworkSwitch-03",
        action: "Port Active",
        user: "System",
        description: "Port GigabitEthernet1/0/22 restored."
    },
    {
        timestamp: "10/24/23 08:30:55",
        severity: "critical",
        source: "CoreRouter-A1",
        action: "Connection Drop",
        user: "System",
        description: "WAN uplink disconnected unexpectedly."
    }
];

function badgeClass(level) {
    if (level === "critical") return "badge critical";
    if (level === "warning") return "badge warning";
    if (level === "info") return "badge info";
    if (level === "error") return "badge error";
    return "badge";
}

function renderEventLogs(items) {
    const body = document.getElementById("eventLogBody");
    body.innerHTML = "";

    items.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${log.time}</td>
            <td><span class="${badgeClass(log.severity)}">${log.severity}</span></td>
            <td>${log.device}</td>
            <td>${log.message}</td>
            <td>${log.duration}</td>
        `;
        body.appendChild(row);
    });

    document.getElementById("activeAlertCount").textContent = items.length;
}

function renderHistoryLogs(items) {
    const body = document.getElementById("historyLogBody");
    body.innerHTML = "";

    items.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td><span class="${badgeClass(log.severity)}">${log.severity}</span></td>
            <td>${log.source}</td>
            <td>${log.action}</td>
            <td>${log.user}</td>
            <td>${log.description}</td>
        `;
        body.appendChild(row);
    });
}

function filterEventLogs() {
    const search = document.getElementById("eventSearch").value.toLowerCase();
    const severity = document.getElementById("severityFilter").value;

    const filtered = eventLogs.filter(log => {
        const matchesSearch =
            log.device.toLowerCase().includes(search) ||
            log.message.toLowerCase().includes(search);

        const matchesSeverity =
            severity === "all" || log.severity === severity;

        return matchesSearch && matchesSeverity;
    });

    renderEventLogs(filtered);
}

function filterHistoryLogs() {
    const search = document.getElementById("historySearch").value.toLowerCase();
    const type = document.getElementById("logTypeFilter").value;

    const filtered = historyLogs.filter(log => {
        const matchesSearch =
            log.source.toLowerCase().includes(search) ||
            log.description.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search);

        const matchesType =
            type === "all" ||
            log.action.toLowerCase().includes(type);

        return matchesSearch && matchesType;
    });

    renderHistoryLogs(filtered);
}

document.getElementById("eventSearch").addEventListener("input", filterEventLogs);
document.getElementById("severityFilter").addEventListener("change", filterEventLogs);

document.getElementById("historySearch").addEventListener("input", filterHistoryLogs);
document.getElementById("logTypeFilter").addEventListener("change", filterHistoryLogs);

renderEventLogs(eventLogs);
renderHistoryLogs(historyLogs);