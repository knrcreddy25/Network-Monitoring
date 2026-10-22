let eventLogs = [];
let historyLogs = [];

async function loadEventLogs() {
    try {
        const response = await fetch("/api/logs/events");

        if (!response.ok) {
            throw new Error("Failed to load event logs");
        }

        eventLogs = await response.json();

        filterEventLogs();

        console.log("Event logs loaded:", eventLogs);

    } catch (error) {
        console.error("Event log error:", error);
    }
}

async function loadHistoryLogs() {
    try {
        const response = await fetch("/api/logs/history");

        if (!response.ok) {
            throw new Error("Failed to load history");
        }

        historyLogs = await response.json();

        filterHistoryLogs();

        console.log("History loaded:", historyLogs);

    } catch (error) {
        console.error("History error:", error);
    }
}

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

document.getElementById("refreshLogs")
    .addEventListener("click", async () => {
        await Promise.all([
            loadEventLogs(),
            loadHistoryLogs()
        ]);
    });

document.getElementById("eventSearch").addEventListener("input", filterEventLogs);
document.getElementById("severityFilter").addEventListener("change", filterEventLogs);

document.getElementById("historySearch").addEventListener("input", filterHistoryLogs);
document.getElementById("logTypeFilter").addEventListener("change", filterHistoryLogs);

loadEventLogs();
loadHistoryLogs();