const crypto = require('crypto');
const ghostData = require('./ghost-data');

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.startCleanupInterval();
  }

  generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }

  createSession(sessionId = this.generateSessionId(), sessionName = null) {
    if (this.sessions.has(sessionId)) {
      throw new Error('Session already exists');
    }

    const session = {
      id: sessionId,
      name: sessionName,
      selectedEvidence: [],
      ruledOutEvidence: [],
      ghostData: ghostData,
      possibleGhosts: [],
      lastActivity: Date.now(),
      connectedClients: new Set(),
      createdAt: Date.now(),
      clientCount: 0
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  updateSessionName(sessionId, name) {
    const session = this.getSession(sessionId);
    session.name = name;
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  hasSession(sessionId) {
    return this.sessions.has(sessionId);
  }

  updateSessionActivity(sessionId) {
    const session = this.getSession(sessionId);
    session.lastActivity = Date.now();
  }

  addClientToSession(sessionId, clientId) {
    const session = this.getSession(sessionId);
    session.connectedClients.add(clientId);
    session.clientCount = session.connectedClients.size;
    this.updateSessionActivity(sessionId);
    return session;
  }

  removeClientFromSession(sessionId, clientId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.connectedClients.delete(clientId);
      session.clientCount = session.connectedClients.size;
      // Clean up empty sessions that are older than 5 minutes
      if (session.connectedClients.size === 0 && 
          Date.now() - session.createdAt > 5 * 60 * 1000) {
        this.sessions.delete(sessionId);
      }
    }
  }

  updateEvidence(sessionId, evidence, { isSelected, isRuledOut }) {
    const session = this.getSession(sessionId);
    
    // Handle selection
    if (isSelected) {
      if (!session.selectedEvidence.includes(evidence)) {
        session.selectedEvidence.push(evidence);
      }
      // Remove from ruled out if it was there
      session.ruledOutEvidence = session.ruledOutEvidence.filter(e => e !== evidence);
    } else {
      session.selectedEvidence = session.selectedEvidence.filter(e => e !== evidence);
    }

    // Handle ruling out
    if (isRuledOut) {
      if (!session.ruledOutEvidence.includes(evidence)) {
        session.ruledOutEvidence.push(evidence);
      }
      // Remove from selected if it was there
      session.selectedEvidence = session.selectedEvidence.filter(e => e !== evidence);
    } else {
      session.ruledOutEvidence = session.ruledOutEvidence.filter(e => e !== evidence);
    }

    this.updatePossibleGhosts(sessionId);
    this.updateSessionActivity(sessionId);
    
    return session;
  }

  updatePossibleGhosts(sessionId) {
    const session = this.getSession(sessionId);

    const possibleGhosts = Object.entries(ghostData).filter(([_, ghost]) => {
      // Ghost must have all selected evidence
      const hasSelectedEvidence = session.selectedEvidence.every(evidence => 
        ghost.evidence.includes(evidence)
      );
      
      // Ghost must not have any ruled out evidence
      const hasNoRuledOutEvidence = session.ruledOutEvidence.every(evidence => 
        !ghost.evidence.includes(evidence)
      );

      return hasSelectedEvidence && hasNoRuledOutEvidence;
    });

    session.possibleGhosts = possibleGhosts;
    return session;
  }

  getSessionState(sessionId) {
    const session = this.getSession(sessionId);
    return {
      selectedEvidence: session.selectedEvidence,
      ruledOutEvidence: session.ruledOutEvidence,
      ghostData: session.ghostData,
      possibleGhosts: session.possibleGhosts
    };
  }

  getActiveSessions() {
    const activeSessions = [];
    for (const [id, session] of this.sessions.entries()) {
      if (session.connectedClients.size > 0) {
        activeSessions.push({
          id,
          name: session.name,
          clientCount: session.connectedClients.size,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity
        });
      }
    }
    return activeSessions;
  }

  startCleanupInterval() {
    // Clean up inactive sessions every hour
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, session] of this.sessions.entries()) {
        // Remove sessions inactive for more than 24 hours
        if (now - session.lastActivity > 24 * 60 * 60 * 1000) {
          this.sessions.delete(sessionId);
        }
      }
    }, 60 * 60 * 1000);
  }
}

module.exports = new SessionManager();
