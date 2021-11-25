let fituj = new FitAddon.FitAddon();
var term = new Terminal({
  fastScrollModifier: true,
  rendererType: "dom",
  cursorStyle: "bar",
});
term.open(document.getElementById("terminal"));
term.loadAddon(fituj);
fituj.fit();
term.write("kozohorsky.xyz - log in.");

var socket;

function connect() {
  socket = io.connect("https://kozohorsky.xyz", {
    reconnect: true,
  });
  socket.on("conekt", hide);
  socket.on("disconekt", show);
  socket.on("connect", function () {
    term.clear();
    term.write("\r\n*** Connected to backend ***\r\n");
    show();
  });
  // Backend -> Browser
  socket.on("data", function (data) {
    term.write(data);
  });
  socket.on("disconnect", function () {
    term.write("\r\n*** Disconnected from backend ***\r\n");
    hide();
    connect();
  });
}

connect();

// Browser -> Backend
term.onKey(function (ev) {
  socket.emit("data", ev.key);
});

function login(el) {
  if ($("#host").val() == "rpi") {
    socket.on("sendHost", (hostInfo) => {
      socket.emit("hostname", {
        pswd: $("#pswd").val(),
        usr: $("#usr").val(),
        port: hostInfo.port,
        host: hostInfo.host,
      });
    });
    socket.emit("getHost");
  } else {
    socket.emit("hostname", {
      pswd: $("#pswd").val(),
      usr: $("#usr").val(),
      port: $("#port").val(),
      host: $("#host").val(),
    });
  }
}

function hide() {
  $("#over").addClass("visually-hidden");
  $("#barriera").addClass("visually-hidden");
  $("#barriera").addClass("disabled");
}

function show() {
  $("#over").removeClass("visually-hidden");
  $("#barriera").removeClass("visually-hidden");
  $("#barriera").removeClass("disabled");
}

$(document).ready(function () {
  $(".txtar").on("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      $("#btn-login").click();
      $("#btn-login").focus();
    }
  });
});

function fitit() {
  fituj.fit();
}

window.addEventListener("resize", fitit);
