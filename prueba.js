const {io} = require("socket.io-client");


const socket = io(
    "http://localhost:3000"
);





socket.on("connect",()=>{


    console.log(
        "Conectado al servidor"
    );



    socket.emit(
        "login",
        "Carlos"
    );



    socket.emit(
        "unirseSala",
        "Programacion"
    );



    // Pedir primera página

    setTimeout(()=>{


        socket.emit(
            "mensajesAntiguos",
            1
        );


    },1000);



});







socket.on("bienvenido",(data)=>{


    console.log(
        data.mensaje
    );


});







socket.on("salaUnida",(data)=>{


    console.log(
        data.mensaje
    );


});







socket.on("mensajesAntiguos",(data)=>{


    console.log(
        "MENSAJES ANTIGUOS:"
    );


    console.log(data);


});