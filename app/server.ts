import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { ChatRoom } from './chatroom'; 

console.log('hello world!');

const PORT = 8080;
const chatroom = new ChatRoom();

const wss = new WebSocketServer({ noServer: true });
const httpServer = http.createServer((req, res) => {

});

httpServer.on('upgrade', (req, socket, head) => {  
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
});

wss.on('connection', (socket: WebSocket, req) => {  
    socket.on('message', (message: string) => {
      console.log(`Received: ${message}`);
        routeMessage(socket, JSON.parse(message));
    });
  
    socket.on('close', () => {
      chatroom.leave(socket);
    });
});

httpServer.listen(PORT, () => {
    console.log('Server Listening on port ', PORT);
})

const routeMessage = (socket: WebSocket, message) => {
    const { type, ...remainingMessage } = message;

    switch (type) {
        case 'chat/join':
            chatroom.join(socket, remainingMessage);
            break;
        case 'chat/leave':
            break;
        case 'chat/message':
            chatroom.message(remainingMessage);
            break;
        default:
            console.log('No route found for:', type);
            
    }
}

interface Message { 
    type: string,
}