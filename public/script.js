// Conexión con el servidor

const socket = io();



let usuario = "";
let salaActual = "General";
const nombre = document.getElementById("nombre");
const btnIngresar =
document.getElementById("btnIngresar");
const salas =
document.getElementById("salas");
const btnSala =
document.getElementById("btnSala");
const mensajes =
document.getElementById("mensajes");
const mensaje =
document.getElementById("mensaje");
const enviar =
document.getElementById("enviar");
const archivo =
document.getElementById("archivo");
const buscar =
document.getElementById("buscar");
const emoji =
document.getElementById("emoji");
const nombreSala =
document.getElementById("nombreSala");


socket.on("connect",()=>{


    console.log(
        "Conectado al servidor"
    );


});




btnIngresar.addEventListener(
"click",
()=>{
    usuario = nombre.value;
    if(usuario.trim() !== ""){

        socket.emit(
            "login",
            usuario
        );
    }
});

socket.on(
"bienvenido",
(data)=>{


    alert(data.mensaje);


});

// Evento que permite al usuario cambiar de sala.


btnSala.addEventListener(
"click",
()=>{
    salaActual = salas.value;
    nombreSala.innerText =
    "Sala " + salaActual;
    socket.emit(
        "unirseSala",
        salaActual
    );
    mensajes.innerHTML = "";
    // cargar historial

    socket.emit(
        "mensajesAntiguos",
        1
    );

});
socket.on(
"salaUnida",
(data)=>{

    console.log(
        data.mensaje
    );

});

// ENVIAR MENSAJE
enviar.addEventListener(
"click",
()=>{

    enviarMensaje();

});

mensaje.addEventListener(
"keypress",
(e)=>{

    if(e.key === "Enter"){

        enviarMensaje();

    }

});

function enviarMensaje(){

    let texto =
    mensaje.value;

    if(texto.trim() === ""){

        return;

    }

    socket.emit(

        "mensaje",
        texto

    );

    mensaje.value="";

}

// RECIBIR MENSAJES

socket.on(
"mensaje",
(data)=>{

    mostrarMensaje(
        data
    );

});


function mostrarMensaje(data){

    const div =
    document.createElement("div");


    div.classList.add(
        "mensaje"
    );


    div.innerHTML = `

        <b>${data.usuario}</b>
        :
        ${data.texto}

    `;

    mensajes.appendChild(div);

    mensajes.scrollTop =
    mensajes.scrollHeight;

}

// HISTORIAL DE CHATS
socket.on(
"mensajesAntiguos",
(data)=>{

    data.forEach(

        mensaje=>{

            mostrarMensaje(
                mensaje
            );
        }
    );

});

// BUSCAR MENSAJES
buscar.addEventListener(
"keyup",
()=>{

    let texto =
    buscar.value;

    if(texto !== ""){

        socket.emit(
            "buscar",

            texto
        );

    }

});

socket.on(
"resultadoBusqueda",
(data)=>{

    mensajes.innerHTML="";

    data.forEach(

        mensaje=>{


            mostrarMensaje(
                mensaje
            );


        }

    );

});

// EMOJI
emoji.addEventListener(
"click",
()=>{


    mensaje.value += "😊";


});

// SUBIR ARCHIVO

archivo.addEventListener(
"change",
async()=>{


    const formData =
    new FormData();

    formData.append(

        "archivo",

        archivo.files[0]

    );

    const respuesta =
    await fetch(

        "http://localhost:3000/archivo",

        {

            method:"POST",

            body:formData

        }

    );

    const resultado =
    await respuesta.json();

socket.emit(

    "mensaje",

    `
    📎 Archivo:
    <a href="${resultado.url}" download>
    ${resultado.archivo}
    </a>
    `
);

});