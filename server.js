var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var arrUser = [];

io.on("connection", function (socket) {
    console.log("Co ket noi " + socket.id);

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


});

app.get("/", function (req, res) {
    res.render("trangchu");
});
