import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';
import express from 'express';
// const app = express();
// app.use(express.json());

const PORT = 8082;
const TERRARIUMS_API_URL = 'http://212.47.71.180:8080/terrariums/user';

// Create a WebSocket server
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });

console.log(`WebSocket server running on ws://0.0.0.0:${PORT}`);

// Fetch terrarium data for a user
const fetchTerrariums = async (userId) => {
    try {
        const response = await fetch(`${TERRARIUMS_API_URL}/${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch terrariums: ${response.statusText}`);
        const terrariums = await response.json();
        return terrariums; // send untouched data from backend
    } catch (error) {
        console.error('Error fetching terrariums:', error.message);
        return [];
    }
};

// const ALARMS_API_URL = 'http://212.47.71.180:8080/alarms/terrarium';

// const fetchAlarms = async (terrariumId) => {
//     try {
//         const response = await fetch(`${ALARMS_API_URL}/${terrariumId}`);
//         if (!response.ok) throw new Error(`Failed to fetch alarms`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching alarms for terrarium ${terrariumId}:`, error.message);
//         return [];
//     }
// };

// const broadcastAlarms = async (terrariumId) => {
//     const alarms = await fetchAlarms(terrariumId);
//     const message = JSON.stringify({ type: "alarm_update", terrariumId, alarms });

//     wss.clients.forEach((client) => {
//         if (client.readyState === 1) {
//             client.send(message);
//         }
//     });

//     console.log(`Broadcasted updated alarms for terrarium ${terrariumId}`);
// };

// app.post('/notify-alarms/:terrariumId', async (req, res) => {
//     const terrariumId = parseInt(req.params.terrariumId, 10);
//     if (isNaN(terrariumId)) return res.status(400).send('Invalid ID');

//     await broadcastAlarms(terrariumId);
//     res.sendStatus(200);
// });

// Store intervals for each WebSocket connection
const intervals = new Map();

// Start periodic updates for a specific WebSocket connection
const startPeriodicUpdates = (ws, userId) => {
    const interval = setInterval(async () => {
        const terrariums = await fetchTerrariums(userId);
        console.log(`Sending data to client:`, terrariums);

        if (ws.readyState === 1) {
            ws.send(JSON.stringify(terrariums));
        }
    }, 10000); // Fetch every 10 seconds

    // Save the interval ID in the map
    intervals.set(ws, interval);
};

// Stop periodic updates for a specific WebSocket connection
const stopPeriodicUpdates = (ws) => {
    const interval = intervals.get(ws);
    if (interval) {
        clearInterval(interval);
        intervals.delete(ws);
    }
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    const userId = 1; // Replace with dynamic user_id if needed

    // Start updates for this client
    startPeriodicUpdates(ws, userId);

    ws.on('close', () => {
        console.log('Client disconnected');
        stopPeriodicUpdates(ws); // Clean up interval
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        stopPeriodicUpdates(ws); // Clean up interval
    });
});

//app.listen(3000, () => console.log('Alarm trigger server running on http://localhost:3000'));

// Clean up on server shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    wss.clients.forEach((ws) => stopPeriodicUpdates(ws));
    process.exit();
});
