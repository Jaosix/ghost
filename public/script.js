let selectedEvidence = new Set();
let ruledOutEvidence = new Set();
let ghostData = null;  // Will be populated from server
let currentSessionId = null;
let currentlyDisplayedGhostId = null;  // Add this to track currently displayed ghost
let huntTimer = null;  // Add this to track hunt timer

document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const evidenceCheckboxes = document.querySelectorAll('.evidence-checkbox');
    const ruleOutButtons = document.querySelectorAll('.rule-out-btn');
    const ghostList = document.getElementById('ghost-list');
    const ghostInfo = document.getElementById('ghost-info');
    const evidenceSound = document.getElementById('evidenceSound');
    const huntAlarm = document.getElementById('huntAlarm');
    const volumeSlider = document.getElementById('volumeSlider');
    const huntButton = document.getElementById('huntButton');
    
    // Session Elements
    const newSessionBtn = document.getElementById('newSessionBtn');
    const sessionList = document.getElementById('sessionList');
    const refreshSessionsBtn = document.getElementById('refreshSessionsBtn');
    const modal = document.getElementById('sessionModal');
    const modalInput = document.getElementById('sessionNameInput');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    // Initialize modal to be hidden
    modal.style.display = 'none';

    // Initialize volume from localStorage or default to 50%
    const savedVolume = localStorage.getItem('evidenceVolume') || '50';
    volumeSlider.value = savedVolume;
    evidenceSound.volume = savedVolume / 100;
    huntAlarm.volume = savedVolume / 100;

    // Hunt button functionality
    function startHunt(playSound = true) {
        huntButton.classList.add('active');
        if (playSound) {
            huntAlarm.currentTime = 0;
            huntAlarm.play().catch(error => console.log('Error playing alarm:', error));
        }
        huntTimer = setTimeout(() => {
            stopHunt();
            socket.emit('huntStateChanged', { isHunting: false });
        }, 33000);
    }

    function stopHunt() {
        if (huntTimer) {
            clearTimeout(huntTimer);
            huntTimer = null;
        }
        huntButton.classList.remove('active');
    }

    huntButton.addEventListener('click', function() {
        if (!currentSessionId) {
            showError('Please join a session first');
            return;
        }

        const isCurrentlyHunting = huntTimer !== null;
        if (isCurrentlyHunting) {
            // Stop the hunt without playing sound
            stopHunt();
            socket.emit('huntStateChanged', { isHunting: false, playSound: false });
        } else {
            // Start the hunt with sound
            startHunt(true);
            socket.emit('huntStateChanged', { isHunting: true, playSound: true });
        }
    });

    // Volume control handler
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        evidenceSound.volume = volume;
        huntAlarm.volume = volume;
        localStorage.setItem('evidenceVolume', this.value);
    });

    // Function to play evidence sound
    function playEvidenceSound() {
        evidenceSound.currentTime = 0;
        evidenceSound.play().catch(error => console.log('Error playing sound:', error));
    }

    // Loading state management
    function setLoading(element, isLoading) {
        if (isLoading) {
            element.disabled = true;
            element.dataset.originalText = element.textContent;
            element.textContent = 'Loading...';
        } else {
            element.disabled = false;
            element.textContent = element.dataset.originalText;
        }
    }

    // Initialize socket connection
    const socket = io();
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    // Session list management
    async function fetchSessions() {
        try {
            sessionList.innerHTML = '<li class="session-list-loading">Loading sessions...</li>';
            const response = await fetch('/api/sessions');
            if (!response.ok) throw new Error('Failed to fetch sessions');
            const data = await response.json();
            updateSessionList(data.sessions);
        } catch (error) {
            sessionList.innerHTML = `
                <li class="session-list-error">
                    Failed to load sessions: ${error.message}
                </li>
            `;
        }
    }

    function updateSessionList(sessions) {
        if (!sessions.length) {
            sessionList.innerHTML = `
                <li class="no-sessions">
                    No active sessions found
                </li>
            `;
            return;
        }

        sessionList.innerHTML = sessions
            .sort((a, b) => b.lastActivity - a.lastActivity)
            .map(session => {
                const timeAgo = getTimeAgo(session.lastActivity);
                const isCurrentSession = session.id === currentSessionId;
                return `
                    <li class="session-item ${isCurrentSession ? 'current' : ''}" data-session-id="${session.id}">
                        <div class="session-info">
                            ${session.name ? `<span class="session-name">${session.name}</span>` : ''}
                            <span class="session-id">${session.id}</span>
                            <span class="session-meta">Last active ${timeAgo}</span>
                        </div>
                        <div class="session-users">
                            <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                            ${session.clientCount}
                        </div>
                    </li>
                `;
            })
            .join('');

        // Add click handlers
        document.querySelectorAll('.session-item').forEach(item => {
            if (item.dataset.sessionId !== currentSessionId) {
                item.addEventListener('click', () => {
                    const sessionId = item.dataset.sessionId;
                    joinSession(sessionId);
                });
            }
        });
    }

    function getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    // Session management
    function showModal() {
        return new Promise((resolve, reject) => {
            // Clear and focus input
            modalInput.value = '';
            
            // Show modal
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('active');
                modalInput.focus();
            });

            function handleKeyPress(e) {
                if (e.key === 'Enter') {
                    resolve(modalInput.value.trim());
                    cleanup();
                } else if (e.key === 'Escape') {
                    reject();
                    cleanup();
                }
            }

            function handleConfirm() {
                resolve(modalInput.value.trim());
                cleanup();
            }

            function handleCancel() {
                reject();
                cleanup();
            }

            function handleOutsideClick(e) {
                if (e.target === modal) {
                    reject();
                    cleanup();
                }
            }

            function cleanup() {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 200);

                modalInput.removeEventListener('keydown', handleKeyPress);
                modalConfirmBtn.removeEventListener('click', handleConfirm);
                modalCancelBtn.removeEventListener('click', handleCancel);
                modal.removeEventListener('click', handleOutsideClick);
            }

            modalInput.addEventListener('keydown', handleKeyPress);
            modalConfirmBtn.addEventListener('click', handleConfirm);
            modalCancelBtn.addEventListener('click', handleCancel);
            modal.addEventListener('click', handleOutsideClick);
        });
    }

    async function createNewSession() {
        try {
            const sessionName = await showModal();
            setLoading(newSessionBtn, true);
            
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: sessionName || null })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create session');
            }
            
            const data = await response.json();
            if (!data.sessionId) {
                throw new Error('Invalid server response');
            }
            
            await joinSession(data.sessionId);
        } catch (error) {
            if (error) { // Only show error if not cancelled
                console.error('Session creation error:', error);
                showError('Failed to create new session: ' + error.message);
            }
        } finally {
            setLoading(newSessionBtn, false);
        }
    }

    async function joinSession(sessionId) {
        try {
            currentSessionId = sessionId;
            socket.emit('joinSession', sessionId);
            
            // Reset evidence
            selectedEvidence.clear();
            ruledOutEvidence.clear();
            updateJournalUI([], []);

            // Store session ID in localStorage for reconnection
            localStorage.setItem('lastSessionId', sessionId);
            
            showSuccess(`Joined session: ${sessionId}`);
            
            // Update session list to show current session
            fetchSessions();
        } catch (error) {
            showError('Failed to join session: ' + error.message);
            currentSessionId = null;
        }
    }

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showSuccess(message) {
        showNotification(message, 'success');
    }

    // Socket event handlers
    socket.on('connect', () => {
        console.log('Connected to server');
        reconnectAttempts = 0;
        
        // Try to rejoin last session
        const lastSessionId = localStorage.getItem('lastSessionId');
        if (lastSessionId && !currentSessionId) {
            joinSession(lastSessionId);
        }

        // Fetch initial session list
        fetchSessions();
    });

    socket.on('connect_error', () => {
        reconnectAttempts++;
        if (reconnectAttempts >= maxReconnectAttempts) {
            showError('Connection lost. Please refresh the page.');
        }
    });

    socket.on('error', (error) => {
        showError(error.message);
    });

    socket.on('journalData', (data) => {
        ghostData = data.ghostData;
        updateJournalUI(data.selectedEvidence, data.ruledOutEvidence);
        updatePossibleGhostsUI(data.possibleGhosts);
        // Refresh ghost info if a ghost is currently displayed
        if (currentlyDisplayedGhostId) {
            showGhostInfo(currentlyDisplayedGhostId);
        }
    });

    socket.on('sessionsUpdated', (data) => {
        updateSessionList(data.sessions);
    });

    socket.on('userJoined', (data) => {
        showSuccess(`A user joined. Users in session: ${data.clientCount}`);
        fetchSessions();
    });

    socket.on('userLeft', (data) => {
        showNotification(`A user left. Users in session: ${data.clientCount}`, 'info');
        fetchSessions();
    });

    socket.on('playEvidenceSound', () => {
        playEvidenceSound();
    });

    // Hunt state synchronization
    socket.on('huntStateChanged', (data) => {
        if (data.isHunting) {
            startHunt(data.playSound);
        } else {
            stopHunt();
        }
    });

    // UI update functions
    function updateJournalUI(serverSelectedEvidence, serverRuledOutEvidence) {
        selectedEvidence = new Set(serverSelectedEvidence);
        ruledOutEvidence = new Set(serverRuledOutEvidence);

        evidenceCheckboxes.forEach(checkbox => {
            const evidenceItem = checkbox.closest('.evidence-item');
            const label = evidenceItem.querySelector('label');
            const evidence = label.textContent;

            checkbox.checked = selectedEvidence.has(evidence);
            const ruleOutBtn = evidenceItem.querySelector('.rule-out-btn');

            if (selectedEvidence.has(evidence)) {
                evidenceItem.classList.remove('ruled-out');
                ruleOutBtn.classList.remove('active');
            }

            if (ruledOutEvidence.has(evidence)) {
                evidenceItem.classList.add('ruled-out');
                ruleOutBtn.classList.add('active');
                checkbox.checked = false;
            } else {
                evidenceItem.classList.remove('ruled-out');
                ruleOutBtn.classList.remove('active');
            }
        });
    }

    function updatePossibleGhostsUI(possibleGhosts) {
        ghostList.innerHTML = '';
        
        // Update ghost count in header
        const resultsHeader = document.querySelector('.results-container h2');
        resultsHeader.innerHTML = `Possible Ghosts <span class="ghost-count">${possibleGhosts.length}</span>`;

        // Add possible ghosts first
        possibleGhosts.forEach(([id, ghost]) => {
            const li = document.createElement('li');
            li.textContent = ghost.name;
            li.classList.add('possible');  // Add possible class
            li.onclick = () => showGhostInfo(id);
            ghostList.appendChild(li);
        });

        // Add ruled out ghosts
        if (ghostData) {
            const ruledOutGhosts = Object.entries(ghostData)
                .filter(([id]) => !possibleGhosts.some(([possibleId]) => possibleId === id));
            
            ruledOutGhosts.forEach(([id, ghost]) => {
                const li = document.createElement('li');
                li.textContent = ghost.name;
                li.onclick = () => showGhostInfo(id);
                ghostList.appendChild(li);
            });
        }
    }

    function showGhostInfo(ghostId) {
        if (!ghostData || !ghostData[ghostId]) return;
        
        currentlyDisplayedGhostId = ghostId;  // Store the currently displayed ghost ID
        const ghost = ghostData[ghostId];
        ghostInfo.innerHTML = `
            <div class="ghost-info">
                <h2>${ghost.name}</h2>
                <div class="evidence-list">
                    ${ghost.evidence.map(e => {
                        let className = 'evidence-tag';
                        if (selectedEvidence.has(e)) {
                            className += ' selected';
                        } else if (ruledOutEvidence.has(e)) {
                            className += ' ruled-out';
                        }
                        return `<span class="${className}">${e}</span>`;
                    }).join('')}
                </div>
                <h3>Strengths</h3>
                <p>${ghost.strengths}</p>
                <h3>Weaknesses</h3>
                <p>${ghost.weaknesses}</p>
                <h3>Behavior</h3>
                <ul class="behavior-list">
                    ${ghost.behavior.map(b => `<li>${b}</li>`).join('')}
                </ul>
                ${ghost.secretBehavior ? `
                    <h3>Secret Behavior</h3>
                    <ul class="behavior-list secret">
                        ${ghost.secretBehavior.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }

    // Event Listeners
    newSessionBtn.addEventListener('click', createNewSession);
    refreshSessionsBtn.addEventListener('click', fetchSessions);

    // Evidence event listeners
    evidenceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!currentSessionId) {
                showError('Please join a session first');
                this.checked = !this.checked;
                return;
            }

            const evidenceItem = this.closest('.evidence-item');
            const label = evidenceItem.querySelector('label');
            const evidence = label.textContent;
            
            if (this.checked) {
                selectedEvidence.add(evidence);
                ruledOutEvidence.delete(evidence);
                evidenceItem.classList.remove('ruled-out');
                evidenceItem.querySelector('.rule-out-btn').classList.remove('active');
            } else {
                selectedEvidence.delete(evidence);
            }

            socket.emit('evidenceUpdated', {
                evidence,
                isSelected: this.checked,
                isRuledOut: false
            });

            // Emit sound event
            socket.emit('evidenceSound');
            playEvidenceSound();
        });
    });

    ruleOutButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!currentSessionId) {
                showError('Please join a session first');
                return;
            }

            const evidenceItem = this.closest('.evidence-item');
            const label = evidenceItem.querySelector('label');
            const evidence = label.textContent;
            const checkbox = evidenceItem.querySelector('.evidence-checkbox');

            const isRulingOut = !this.classList.contains('active');
            
            if (isRulingOut) {
                ruledOutEvidence.add(evidence);
                selectedEvidence.delete(evidence);
                evidenceItem.classList.add('ruled-out');
                this.classList.add('active');
                checkbox.checked = false;
            } else {
                ruledOutEvidence.delete(evidence);
                evidenceItem.classList.remove('ruled-out');
                this.classList.remove('active');
            }

            socket.emit('evidenceUpdated', {
                evidence,
                isSelected: false,
                isRuledOut: isRulingOut
            });

            // Emit sound event
            socket.emit('evidenceSound');
            playEvidenceSound();
        });
    });
});
