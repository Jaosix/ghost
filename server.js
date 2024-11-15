const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const sessionManager = require('./session-manager');
const helmet = require('helmet');

const app = express();

// Trust proxy (needed for Cloudflare)
app.set('trust proxy', true);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'https://your-domain.com', // Replace with your domain
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

const port = 4224;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // For socket.io client
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'", 'wss:', 'ws:'], // For WebSocket connections
      fontSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  }
}));

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove HTML tags and limit length
        req.body[key] = req.body[key]
          .replace(/[<>]/g, '')
          .slice(0, 100);
      }
    }
  }
  next();
};

app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(sanitizeInput);
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Input validation middleware for session operations
const validateSessionInput = (req, res, next) => {
  const { name } = req.body;
  if (name && (typeof name !== 'string' || name.length > 100 || /[<>]/.test(name))) {
    return res.status(400).json({ error: 'Invalid session name' });
  }
  next();
};

// Create a new session
app.post('/api/sessions', validateSessionInput, (req, res) => {
  try {
    const { name } = req.body;
    const session = sessionManager.createSession(undefined, name);
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update session name
app.put('/api/sessions/:sessionId/name', validateSessionInput, (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name } = req.body;
    const session = sessionManager.updateSessionName(sessionId, name);
    res.json({ success: true });
    // Broadcast session list update
    io.emit('sessionsUpdated', {
      sessions: sessionManager.getActiveSessions()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of active sessions
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = sessionManager.getActiveSessions();
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate socket data
const validateSocketData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (data.evidence && (typeof data.evidence !== 'string' || data.evidence.length > 100)) return false;
  if (data.isSelected !== undefined && typeof data.isSelected !== 'boolean') return false;
  if (data.isRuledOut !== undefined && typeof data.isRuledOut !== 'boolean') return false;
  return true;
};

// Validate hunt state data
const validateHuntData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.isHunting !== 'boolean') return false;
  if (data.playSound !== undefined && typeof data.playSound !== 'boolean') return false;
  return true;
};

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Handle joining a session
  socket.on('joinSession', (sessionId) => {
    try {
      if (typeof sessionId !== 'string' || sessionId.length > 100) {
        throw new Error('Invalid session ID');
      }

      // Leave any previous session
      if (socket.currentSession) {
        sessionManager.removeClientFromSession(socket.currentSession, socket.id);
        socket.leave(socket.currentSession);
      }

      // Create session if it doesn't exist
      if (!sessionManager.hasSession(sessionId)) {
        sessionManager.createSession(sessionId);
      }
      
      // Join the session
      const session = sessionManager.addClientToSession(sessionId, socket.id);
      socket.join(sessionId);
      socket.currentSession = sessionId;

      // Send initial journal data to the new client
      socket.emit('journalData', sessionManager.getSessionState(sessionId));
      
      // Notify other clients in the session
      socket.to(sessionId).emit('userJoined', { 
        clientCount: session.connectedClients.size 
      });

      // Broadcast updated session list to all clients
      io.emit('sessionsUpdated', {
        sessions: sessionManager.getActiveSessions()
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle evidence selection/rule-out events
  socket.on('evidenceUpdated', (data) => {
    try {
      if (!socket.currentSession) {
        throw new Error('Not connected to a session');
      }

      if (!validateSocketData(data)) {
        throw new Error('Invalid evidence data');
      }

      const { evidence, isSelected, isRuledOut } = data;
      
      // Update the session data
      sessionManager.updateEvidence(socket.currentSession, evidence, {
        isSelected,
        isRuledOut
      });

      // Broadcast the updated journal data to all clients in the same session
      io.to(socket.currentSession).emit(
        'journalData', 
        sessionManager.getSessionState(socket.currentSession)
      );

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle hunt state changes
  socket.on('huntStateChanged', (data) => {
    try {
      if (!socket.currentSession) {
        throw new Error('Not connected to a session');
      }

      if (!validateHuntData(data)) {
        throw new Error('Invalid hunt state data');
      }

      // Broadcast the hunt state to all other clients in the session
      socket.to(socket.currentSession).emit('huntStateChanged', {
        isHunting: data.isHunting,
        playSound: data.playSound
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle evidence sound event
  socket.on('evidenceSound', () => {
    if (socket.currentSession) {
      // Broadcast sound event to all other clients in the session
      socket.to(socket.currentSession).emit('playEvidenceSound');
    }
  });

  socket.on('disconnect', () => {
    if (socket.currentSession) {
      try {
        const session = sessionManager.getSession(socket.currentSession);
        sessionManager.removeClientFromSession(socket.currentSession, socket.id);
        
        // Notify remaining clients in the session
        if (session.connectedClients.size > 0) {
          io.to(socket.currentSession).emit('userLeft', { 
            clientCount: session.connectedClients.size 
          });
        }

        // Broadcast updated session list to all clients
        io.emit('sessionsUpdated', {
          sessions: sessionManager.getActiveSessions()
        });
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
    }
    console.log('Client disconnected');
  });
});

// Listen on all network interfaces
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Access using your local network IP address');
});
