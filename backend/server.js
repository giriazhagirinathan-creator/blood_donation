import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import pg from 'pg';
import dns from 'dns';

// Load env vars
dotenv.config();

// Set DNS to Google to ensure Aiven hostname resolves
dns.setServers(['8.8.8.8']);

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection (Aiven Cloud)
const { Pool } = pg;
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to Aiven PostgreSQL Cloud Database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL Connection Error:', err.message);
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Blood Emergency API is running on Cloud...');
});

// API route to fetch donors
app.get('/api/donors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM donors ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a Donor
app.delete('/api/donors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM donors WHERE id = $1', [id]);
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API routes for Blood Requests
app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blood_requests ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/requests', async (req, res) => {
  const { patientName, age, bloodGroup, hospitalName, address, phoneNumber, urgency } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO blood_requests ("patientName", age, "bloodGroup", "hospitalName", address, "phoneNumber", urgency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [patientName, age, bloodGroup, hospitalName, address, phoneNumber, urgency]
    );
    
    const newRequest = result.rows[0];
    
    // Broadcast the new request via Socket.io
    io.emit('new_emergency', newRequest);
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a Blood Request
app.delete('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM blood_requests WHERE id = $1', [id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a Blood Request Status
app.put('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE blood_requests SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io integration
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
