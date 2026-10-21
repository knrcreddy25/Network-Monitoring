
const devices = [
    {
        id: 1,
        name: "EdgeRouter Pro",
        ip: "192.168.1.1",
        type: "router",
        status: "online"
    },
    {
        id: 2,
        name: "CoreSwitch-1",
        ip: "192.168.1.2",
        type: "switch",
        status: "online"
    },
    {
        id: 3,
        name: "AppServer-1",
        ip: "192.168.1.10",
        type: "server",
        status: "online"
    },
    {
        id: 4,
        name: "Dev-Workstation",
        ip: "192.168.1.50",
        type: "pc",
        status: "offline"
    },
    {
        id: 5,
        name: "IoT-Sensor",
        ip: "192.168.1.70",
        type: "iot",
        status: "warning"
    },
    {
        id: 6,
        name: "Office-PC",
        ip: "192.168.1.51",
        type: "pc",
        status: "online"
    }
];




function updateDashboard() {
    const total = devices.length;

    const online = devices.filter(device => device.status === "online").length;
    const offline = devices.filter(device => device.status === "offline").length;
    const warning = devices.filter(device => device.status === "warning").length;

    const health = total === 0 ? 0 : (online / total) * 100;

    // Network Health
    document.getElementById("healthPercent").textContent = health.toFixed(1) + "%";
    document.getElementById("healthNote").textContent = online + " healthy devices";

    // Total Traffic (demo values for now)
    document.getElementById("totalTraffic").textContent = 452;
    document.getElementById("trafficChange").textContent = "↑ 180 ↓ 272";

    // Active Alerts
    document.getElementById("criticalAlerts").textContent = offline + " Critical";
    document.getElementById("warningAlerts").textContent = warning + " Warnings";

    // Monitored Devices
    document.getElementById("monitoredTotal").textContent = total;
    document.getElementById("monitoredUp").textContent = online;
    document.getElementById("monitoredDown").textContent = offline;
}

updateDashboard();




function createDeviceChart() {

    const deviceTypes = {};

    // Count devices by type
    devices.forEach(device => {
        const type = device.type;

        deviceTypes[type] = (deviceTypes[type] || 0) + 1;
    });

    const labels = Object.keys(deviceTypes);
    const counts = Object.values(deviceTypes);

    const ctx = document.getElementById("deviceChart");

    new Chart(ctx, {
        type: "doughnut",

        data: {
            labels: labels,

            datasets: [{
                data: counts,
                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#8b5cf6",
                    "#06b6d4"
                ],
                borderWidth: 0
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

createDeviceChart();



function createAvailabilityChart() {

    const times = [
        "10:00", "10:05", "10:10",
        "10:15", "10:20", "10:25",
        "10:30", "10:35"
    ];

    // Sample historical availability percentages
    const availability = [
        100, 100, 80, 80, 60, 80, 100, 80
    ];

    const ctx = document.getElementById("availabilityChart");

    new Chart(ctx, {
        type: "line",

        data: {
            labels: times,
            datasets: [{
                label: "Device Availability (%)",
                data: availability,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + "%"
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

createAvailabilityChart();



const activities = [
    {
        title: "Network scan completed",
        description: "5 devices scanned successfully",
        time: "10:30 AM",
        type: "success",
        icon: "✓"
    },
    {
        title: "Device disconnected",
        description: "Dev-Workstation · 192.168.1.50",
        time: "10:25 AM",
        type: "danger",
        icon: "!"
    },
    {
        title: "Device health warning",
        description: "IoT-Sensor · 192.168.1.70",
        time: "10:20 AM",
        type: "warning",
        icon: "!"
    },
    {
        title: "New device connected",
        description: "AppServer-1 · 192.168.1.10",
        time: "10:15 AM",
        type: "info",
        icon: "+"
    }
];

function displayRecentActivity() {
    const container = document.getElementById("recentActivity");
    container.replaceChildren();

    activities.forEach(activity => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const icon = document.createElement("div");
        icon.className = `timeline-icon ${activity.type}`;
        icon.textContent = activity.icon;

        const content = document.createElement("div");
        content.className = "timeline-content";

        const title = document.createElement("strong");
        title.textContent = activity.title;

        const description = document.createElement("p");
        description.textContent = activity.description;

        const time = document.createElement("small");
        time.textContent = activity.time;

        content.append(title, description, time);
        item.append(icon, content);
        container.appendChild(item);
    });
}

displayRecentActivity();



function displayProblemDevices() {

    const container = document.getElementById("problemDevices");

    container.innerHTML = "";

    const problemDevices = devices.filter(device =>
        device.status === "offline" ||
        device.status === "warning"
    );

    if (problemDevices.length === 0) {
        container.textContent = "All devices are operating normally.";
        return;
    }

    problemDevices.forEach(device => {

        const item = document.createElement("div");
        item.className = "problem-item " + device.status;

        const name = document.createElement("strong");
        name.textContent = device.name;

        const info = document.createElement("span");
        info.textContent = device.ip;

        const status = document.createElement("span");
        status.className = "device-status " + device.status;
        status.textContent = device.status.toUpperCase();

        item.append(name, info, status);
        container.appendChild(item);
    });
}

displayProblemDevices();

