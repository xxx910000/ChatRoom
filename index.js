const { Console } = require('console');
const { Socket } = require('dgram');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
app.get('/',(req,res) => {
    res.sendFile(__dirname+"/views/index.html");
});

let onlineCount = 0;
// 當發生連線事件
io.on('connection',(socket) =>{
    console.log('connect');
    // 有連線發生時增加人數
    onlineCount++;
    io.emit("online",onlineCount);

    socket.on("send", (msg) =>{
        io.emit("msg",msg);
    });

    socket.on('disconnect', ()=>{
        console.log('disconnect');
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online",onlineCount);
    });
});

server.listen(3000, () =>{
    console.log("Server Started. http://localhost:3000");
});
