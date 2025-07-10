const sessionMap = new Map(); // sessionId => { agentId, visitorId }

function assignSession(sessionId, agentId, visitorId) {
  sessionMap.set(sessionId, { agentId, visitorId });
}

function getSession(sessionId) {
  return sessionMap.get(sessionId);
}

function removeSession(sessionId) {
  sessionMap.delete(sessionId);
}

module.exports = {
  assignSession,
  getSession,
  removeSession,
};