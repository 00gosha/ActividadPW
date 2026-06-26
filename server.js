const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");



const app = express();

app.use(cors());

app.use(express.json());



// Servir frontend

app.use(express.static("public"));



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









// HISTORIAL DE MENSAJES


let historial = {


    General: [],

    Programacion: [],

    Videojuegos: [],

    Musica: [],

    Tecnologia: [],

    Deportes: []


};









// CONFIGURACION DE ARCHIVOS


const storage = multer.diskStorage({


    destination:(req,file,cb)=>{


        cb(
            null,
            "uploads/"
        );


    },



    filename:(req,file,cb)=>{


        cb(

            null,

            Date.now()
            +
            "-"
            +
            file.originalname

        );


    }



});




const upload = multer({

    storage

});











// SOCKET.IO


io.on("connection",(socket)=>{



    console.log(
        "Nuevo usuario conectado"
    );







    // LOGIN


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









    // ENTRAR A SALA


    socket.on("unirseSala",(sala)=>{



        // Si la sala no existe la crea

        if(!historial[sala]){


            historial[sala] = [];


        }




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









    // ENVIAR MENSAJE


    socket.on("mensaje",(texto)=>{



        if(!socket.salaActual){


            return;


        }





        const nuevoMensaje = {



            usuario:
            socket.nombre,



            texto:
            texto,



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












    // CARGAR HISTORIAL


    socket.on("mensajesAntiguos",(pagina)=>{



        if(!socket.salaActual){


            return;


        }






        const cantidad = 10;



        const mensajesSala =

        historial[socket.salaActual];





        const fin =

        mensajesSala.length -

        ((pagina - 1) * cantidad);





        const inicio =

        fin - cantidad;







        const mensajes =

        mensajesSala.slice(

            Math.max(0,inicio),

            fin

        );







        socket.emit(

            "mensajesAntiguos",

            mensajes

        );




    });












    // BUSCAR MENSAJES


    socket.on("buscar",(texto)=>{



        if(!socket.salaActual){


            return;


        }





        const resultados =


        historial[socket.salaActual]
        .filter(


            mensaje =>


            mensaje.texto

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












    // DESCONECTAR


    socket.on("disconnect",()=>{


        console.log(

            "Usuario desconectado"

        );


    });





});











// SUBIR ARCHIVOS



app.post(

    "/archivo",

    upload.single("archivo"),



    (req,res)=>{


        res.json({


            mensaje:

            "Archivo subido correctamente",



            archivo:

            req.file.filename,


            url:

            "/uploads/" + req.file.filename



        });



    }


);









// PAGINA PRINCIPAL


app.get("/",(req,res)=>{


    res.sendFile(

        __dirname +
        "/public/index.html"

    );


});











// INICIAR SERVIDOR


server.listen(

    3000,

    ()=>{


        console.log(

            "Servidor iniciado en puerto 3000"

        );


    }

);