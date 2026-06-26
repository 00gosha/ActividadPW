const {io}=require("socket.io-client");


const socket=io("http://localhost:3000");


socket.on("connect",()=>{


    console.log("Conectado");


    socket.emit("login","Carlos");


});


socket.on("bienvenido",(data)=>{

    console.log(data.mensaje);

});


socket.on("notificacion",(data)=>{

    console.log(data.mensaje);

});