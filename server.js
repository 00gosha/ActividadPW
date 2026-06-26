const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);



const io = new Server(server, {
    cors: {
        origin: "*"
    }
});



let usuarios = [];

let salas = [
    "General",
    "Programacion",
    "Videojuegos",
    "Musica"
];

io.on("connection", (socket)=>{


    console.log("Nuevo usuario conectado");




    socket.on("login",(nombre)=>{


        socket.nombre = nombre;


        usuarios.push(nombre);


        console.log(nombre + " ingresó al chat");




        socket.emit("bienvenido",{

            mensaje:"Bienvenido " + nombre

        });




        socket.broadcast.emit("notificacion",{

            mensaje:nombre + " se conectó al chat"

        });


    });





    socket.on("disconnect",()=>{


        console.log("Usuario desconectado");


        if(socket.nombre){


            usuarios = usuarios.filter(

                usuario => usuario !== socket.nombre

            );



            socket.broadcast.emit("notificacion",{

                mensaje:socket.nombre + " salió del chat"

            });


        }


    });



});


app.get("/",(req,res)=>{


    res.send("Servidor del chat funcionando");


});



server.listen(3000,()=>{


    console.log("Servidor iniciado en puerto 3000");


});