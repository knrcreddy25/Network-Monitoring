const express = require('express');
const path = require('path');
const devices = require('./data/devices.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const findDevice = (id) => devices.find((d) => d.id === id);

// All devices (used by the LAN map and the table)
app.get('/api/devices', (req, res) => res.json(devices));

// One device (used later by device-details.html?id=...)
app.get('/api/devices/:id', (req, res) => {
  const device = findDevice(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
});

// Scan the whole network.
// MOCK: only updates "lastSeen". Replace with real ping / ARP / nmap logic later.
app.post('/api/scan', (req, res) => {
  const scannedAt = new Date().toISOString();
  devices.forEach((d) => {
    if (d.status !== 'offline') d.lastSeen = scannedAt;
  });
  res.json({ scannedAt, devices });
});

// Scan a single device (MOCK)
app.post('/api/devices/:id/scan', (req, res) => {
  const device = findDevice(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  if (device.status !== 'offline') device.lastSeen = new Date().toISOString();
  res.json(device);
});

app.listen(PORT, () => {
  console.log(`NetworkMonitor running at http://localhost:${PORT}/lanmap.html`);
});
