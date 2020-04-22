const express = require("express");
const app = express();
const fs = require('fs');
const cert = fs.readFileSync('./cert.pem');
const key = fs.readFileSync('./key.pem');
app.use(express.static(__dirname + '/public/'))
const https = require('https');

const server = require('http').Server(app);
//const server = https.createServer({key: key, cert: cert }, app);
const io = require('socket.io')(server);

server.listen(8080, () => {
    console.log(`Listening on 8080`);
});
/*

//https://vishalabhang.github.io/HostRTC/
//const socketio=require('socket.io')0
const expressServer =app.listen(8080,()=>{
    console.log("Server Is Runnig on PORT 8080");
});
const io =socketio(expressServer);
*/

io.on('connection', (socket) => {
    console.log(io.engine.clientsCount);
    //console.log(socket.id);
    socket.emit('MsgFromServer', { data: "Welcome TO Socket.io" });
    socket.on('MsgToServer', (DataFromClient) => {
        console.log(socket.id, DataFromClient);
    });

    socket.on('NewMsgToServer', (msg) => {
        console.log(socket.id, msg);
        io.of('/').emit('MsgToClient', { data: msg })
    });

    socket.on('disconnect', function () { });

    socket.on('CreateMeeting', (DataFromClient) => {
        console.log(DataFromClient);
        meetingJoin(DataFromClient)
        io.of('/').emit('MsgToClient','/'+ DataFromClient )
    });
    socket.on('SDPS', (DataFromClient) => {
        console.log("SDP received");
        //meetingJoin(DataFromClient)
        //io.of('/').emit('SDPR', DataFromClient )
        socket.broadcast.emit('SDPR', DataFromClient);
    });
});

function meetingJoin(data) {
    const nsp = io.of('/' + data);
    nsp.on('connection', function (socket) {
        console.log('someone connected');
        nsp.emit('hi', 'everyone!');
    });
   
}