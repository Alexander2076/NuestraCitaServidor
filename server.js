
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const servidor = http.createServer(app);

const io = new Server(servidor, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.send("❤️ Servidor Nuestra Cita funcionando ❤️");
});

io.on("connection", (socket) => {

    console.log("❤️ Una persona se conectó");

    socket.on("crearSala", (codigo) => {

        socket.join(codigo);

        console.log(
            `💕 Sala creada: ${codigo}`
        );

        socket.emit(
            "salaCreada",
            codigo
        );
    });


    socket.on("unirseSala", (codigo) => {

        const sala = io.sockets.adapter.rooms.get(codigo);

        if (sala && sala.size >= 2) {

            socket.emit(
                "salaLlena"
            );

            return;
        }

        socket.join(codigo);

        console.log(
            `💕 Una persona se unió a: ${codigo}`
        );

        socket.emit(
            "salaUnida",
            codigo
        );

        socket.to(codigo).emit(
            "parejaEntro"
        );
    });


    socket.on("disconnect", () => {

        console.log(
            "💔 Una persona se desconectó"
        );

    });

});


const PORT = process.env.PORT || 3000;

servidor.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Servidor funcionando en el puerto ${PORT}`
    );

});