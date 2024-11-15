# Phasmophobia Multi-User Journal

A collaborative web application for Phasmophobia players to track evidence and share ghost information in real-time.

## Features

- Real-time evidence tracking across multiple users
- Ghost information and behavior details
- Session management for different groups
- Sound notifications for evidence updates
- Hunt timer with visual and audio alerts
- Volume control for sound effects

## Prerequisites

- Node.js (v14 or higher)
- npm
- Cloudflare account (for tunneling) or your own server IP/routing, whatever your situation. 

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
cd ghost2
npm install
```

3. Configure your domain:
   - Open `server.js`
   - Replace `'https://your-domain.com'` with your actual domain in the Socket.IO CORS configuration

4. Start the server:
```bash
npm start
```

The application will be running on port 4224.

## Cloudflare Tunnel Setup

This application is designed to work with Cloudflare Tunnels for secure, public access. 
It is installed on the local network and uses Cloudflare as the reverse proxy.

## Usage

1. Create or join a session
2. Select evidence as you find it in-game
3. Use the HUNT button during ghost hunts
4. View possible ghosts based on collected evidence
5. Share ghost information with your team

## Technologies Used

- Node.js
- Express
- Socket.IO
- HTML5
- CSS3
- JavaScript
- Cloudflare Tunnels

## Security Features

- Helmet.js for secure headers
- Input sanitization
- Rate limiting
- CORS configuration
- Proxy trust for Cloudflare

## Note

This is a personal project. You're welcome to clone and use it for your own purposes.
