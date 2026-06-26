const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");


const app = express();


app.use(cors());

app.use(express.json());


// Servir frontend

app.use(
    express.static("public")
);



// Servir archivos subidos

app.use(
    "/uploads",
    express.static("uploads")
);





const server = http.createServer(app);





const io = new Server(server, {

    cors:{
        origin:"*"
    }

});







// Configuración archivos


const storage = multer.diskStorage({

    destination:"uploads/",


    filename:(req,file,cb)=>{


        cb(

            null,

            Date.now() +
            "-" +
            file.originalname

        );


    }


});



const upload = multer({

    storage

});







let historial = {


    General:[],

    Programacion:[],

    Videojuegos:[],

    Musica:[]


};









io.on("connection",(socket)=>{


    console.log(
        "Nuevo usuario conectado"
    );





    socket.on("login",(nombre)=>{


        socket.nombre = nombre;



        console.log(
            nombre +
            " ingresó al chat"
        );



        socket.emit(
            "bienvenido",
            {

            mensaje:
            "Bienvenido " + nombre

            }
        );


    });








    socket.on("unirseSala",(sala)=>{


        socket.join(sala);


        socket.salaActual = sala;



        console.log(

            socket.nombre +
            " entró a " +
            sala

        );



        socket.emit(

            "salaUnida",

            {

            mensaje:
            "Entraste a la sala " + sala

            }

        );


    });









    socket.on("mensaje",(texto)=>{


        const nuevoMensaje = {


            usuario:
            socket.nombre,


            texto:texto,


            fecha:
            new Date()


        };



        historial[socket.salaActual]
        .push(nuevoMensaje);




        io.to(socket.salaActual)
        .emit(

            "mensaje",

            nuevoMensaje

        );



    });









    socket.on("mensajesAntiguos",(pagina)=>{


        const cantidad = 10;



        const fin =

        historial[socket.salaActual]
        .length -

        ((pagina-1)*cantidad);



        const inicio =

        fin - cantidad;



        const mensajes =

        historial[socket.salaActual]
        .slice(

            Math.max(0,inicio),

            fin

        );




        socket.emit(

            "mensajesAntiguos",

            mensajes

        );



    });









    socket.on("buscar",(texto)=>{


        const resultados =

        historial[socket.salaActual]
        .filter(

            m =>

            m.texto
            .toLowerCase()
            .includes(
                texto.toLowerCase()
            )

        );



        socket.emit(

            "resultadoBusqueda",

            resultados

        );



    });









    socket.on("disconnect",()=>{


        console.log(

            "Usuario desconectado"

        );


    });





});









// Subir archivos


app.post(

"/archivo",

upload.single("archivo"),


(req,res)=>{


    res.json({

        mensaje:
        "Archivo subido correctamente",


        archivo:
        req.file.filename


    });


}

);










server.listen(3000,()=>{


    console.log(

        "Servidor iniciado en puerto 3000"

    );


});