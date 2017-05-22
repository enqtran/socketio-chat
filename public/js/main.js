var socket = io("http://localhost:3000");

socket.on("server-send-Username-thatbai", function () {
    alert('dk that bai');
});
socket.on("server-send-Username-thanhcong", function (data) {
    $('#currentUser').html(data);
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);
});

socket.on("server-send-danhsach-user", function (data) {
    $('#boxContent').html("");

    data.forEach(function (i) {
        $('#boxContent').append("<div class='useronline'> " + i + "</div>");
    });

});
socket.on("server-send-messages", function (data) {
    $('#listMessages').append("<div class='ms'>" + data.username + " : " + data.content + "</div>")
});

socket.on("server-send-typing", function (data) {
    $('#typing').html(data);
});
socket.on("server-stop-typing", function (data) {
    $('#typing').html('');
});

jQuery(document).ready(function ($) {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#txtMessages').focusin(function () {
        socket.emit("typing");
    });

    $('#txtMessages').focusout(function () {
        socket.emit("typing-out");
    });

    $('#btnRegister').click(function () {
        socket.emit("client-send-Username", $('#txtUsername').val());
    });

    $('#btnLogout').click(function () {
        socket.emit("client-logout");
        $('#loginForm').show(2000);
        $('#chatForm').hide(1000);
    });

    $('#btnSendMessages').click(function () {
        socket.emit("client-send-messages", $('#txtMessages').val());
        $('#txtMessages').val('');
    });
});
