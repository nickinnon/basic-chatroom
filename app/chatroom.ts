

export class ChatRoom {
    private connectClients = new Map<string, WebSocket>();

    join(socket, request) {
        this.connectClients.set(request.userName, socket);

        socket.send(JSON.stringify({message: `Welcome, ${request.userName}`}));

        this.message({ message: `${request.userName} has joined the chat` });
        console.log('User Connected', request.userName);
        // console.log(this.connectClients);
    }

    leave(socket) {
        let leftUserName = '';
        for (const [userName, clientSocket] of this.connectClients ) {
            if (socket === clientSocket) {
                leftUserName = userName;
                this.connectClients.delete(userName);
            }
        }

        const message = `${leftUserName} has left the chat`;
        this.message({ message });
    }

    message(message) {
        console.log('Message Broadcast', message);
        console.log(this.connectClients);
        this.connectClients.forEach((socket, userName) => {
            socket.send(JSON.stringify({
                ...message
            }));
        })

    }
}