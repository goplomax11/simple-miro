const express = require('express');
const app = express();
const WSServes = require("express-ws")(app);
const aWss = WSServes.getWss()

const PORT = process.env.PORT || 5000;

app.ws("/", (ws, req) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg);
        switch(msg.method) {
            case "connection":
                connectionHandler(ws, msg);
                break
        }

    })
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`))

const connectionHandler = (ws, msg) => {

    ws.id = msg.id;
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    console.log(msg)
    aWss.clients.forEach(client => {

        console.log(client)
        if(client.id === msg.id) {
            client.send(`User ${msg.username} is connected`)
        }
    })
}