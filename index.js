
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config({path:"./config/config.env"});

const app = express();
const server = http.createServer(app);
const io = new socket.Server(server);

// static files
app.use(express.static("public"));



const port = process.env.port || 3000;
server.listen(port,()=>{console.log(`server is running on port ${port} `)});


// setup io
const users = {}

io.on("connection", socket=>{
    // console.log(`user connected . ${socket.id}`);

    socket.on("login",data=>{
        console.log(`${data.nickname} connected .`);
        socket.join(data.RoomNumber)
        users[socket.id] = {
            nickname :data.nickname,
            RoomNumber : data.RoomNumber,
            chatRoomPass : data.chatRoomPass
        };
        io.sockets.emit("online",users)
    })

    socket.on("disconnect",()=>{
        console.log(`user disconnected .`);
        delete users[socket.id];
        io.sockets.emit("online",users)
    }
    )

    socket.on("chat message", data=>{   // on means listen  emit means send
        // io.sockets.emit("chat message" , data)  // sockets is for everyone
        io.to(data.RoomNumber).emit("chat message",data)
    })

    socket.on("typing" , data =>{
        socket.to(data.RoomNumber).emit("typing",data);
    })
})

