/**
 * Backend Server Entry Point
 * Provides REST API for the persistent world simulation
 */

import { createServer } from 'http';
import { WorldSimulator } from './services/WorldSimulator.js';

const worldSimulator = new WorldSimulator();
worldSimulator.start();

const players = new Map<string, any>();

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // GET /api/world - Get current world state
  if (url.pathname === '/api/world' && req.method === 'GET') {
    try {
      const worldState = worldSimulator.getWorldState();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(worldState));
    } catch (error) {
      console.error('Error getting world state:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get world state' }));
    }
    return;
  }

  // POST /api/events - Inject events into the world
  if (url.pathname === '/api/events' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        worldSimulator.injectEvent(event);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error injecting event:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid event data' }));
      }
    });
    return;
  }

  // POST /api/players - Create or update player
  if (url.pathname === '/api/players' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const playerData = JSON.parse(body);
        const playerId = playerData.id || Date.now().toString();
        players.set(playerId, playerData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: playerId, ...playerData }));
      } catch (error) {
        console.error('Error creating player:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid player data' }));
      }
    });
    return;
  }

  // GET /api/players/:id - Get player by ID
  if (url.pathname.startsWith('/api/players/') && req.method === 'GET') {
    const playerId = url.pathname.split('/')[3];
    if (playerId && players.has(playerId)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(players.get(playerId)));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Player not found' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = parseInt(process.env.PORT || '3000');
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/world        - Get current world state');
  console.log('  POST   /api/events       - Inject events into the world');
  console.log('  POST   /api/players      - Create/update player');
  console.log('  GET    /api/players/:id  - Get player by ID');
});

process.on('SIGINT', () => {
  console.log('\nShutting down backend server...');
  worldSimulator.stop();
  server.close(() => {
    console.log('Backend server stopped');
    process.exit(0);
  });
});