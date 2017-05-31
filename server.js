var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

var port = Number(process.env.PORT || 8888);
server.listen(port);

var arrUser = [];

console.log(port);

io.on("connection", function (socket) {
    console.log("Co ket noi " + socket.id);
    console.log(socket.adapter.rooms);

    socket.on("client-send-Username", function (data) {
        if (arrUser.indexOf(data) >= 0) {
            socket.emit("server-send-Username-thatbai");
        } else {
            arrUser.push(data);
            socket.Username = data;
            socket.emit("server-send-Username-thanhcong", data);

            io.sockets.emit("server-send-danhsach-user", arrUser);
        }
    });

    socket.on("client-logout", function () {
        arrUser.splice(
            arrUser.indexOf(socket.Username), 1
        );

        socket.broadcast.emit("server-send-danhsach-user", arrUser);
    });

    socket.on("client-send-messages", function (data) {
        io.sockets.emit("server-send-messages", { username: socket.Username, content: data });
    });

    socket.on("typing", function () {
        var typing = socket.Username + "....";
        socket.broadcast.emit("server-send-typing", typing);
    });

    socket.on("typing-out", function () {
        socket.broadcast.emit("server-stop-typing");
    });


    socket.on("client-tao-room", function (data) {
        socket.join(data);
        socket.phong = data;

        var arrRoom = [];
        for (r in socket.adapter.rooms) {
            arrRoom.push(r);
        }

        io.sockets.emit("all-room", arrRoom);
        io.sockets.emit("sv-send-room", data);
    });

    socket.on("user-chat", function(data){
        io.sockets.in(socket.phong).emit("server-chat",{ username: socket.Username, content: data });
    });




});

app.get("/", function (req, res) {
    res.render("trangchu");
});
