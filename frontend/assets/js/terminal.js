let fituj = new FitAddon.FitAddon();
var term = new Terminal({
  fastScrollModifier: true,
  rendererType: "dom",
  cursorStyle: "bar"
});
term.open(document.getElementById('terminal'));
term.loadAddon(fituj);
fituj.fit();
term.write('kozohorsky.xyz - log in.');

var socket = io.connect('https://kozohorsky.xyz');
socket.on('connect', function() {
    term.write('\r\n*** Connected to backend ***\r\n');
});

        // Browser -> Backend
term.onKey(function (ev) {
    socket.emit('data', ev.key);
});

        // Backend -> Browser
socket.on('data', function(data) {
    term.write(data);
});

socket.on('disconnect', function() {
    term.write('\r\n*** Disconnected from backend ***\r\n');
});

function login(el){
    socket.emit('hostname', { pswd: $('#pswd').val(), usr: $('#usr').val() });
}

socket.on('conekt', () => {
  $('#over').addClass('visually-hidden');
  $('#barriera').addClass('visually-hidden');
  $('#barriera').addClass('disabled');
});
          
socket.on('disconekt', () => {
  $('#over').removeClass('visually-hidden');
  $('#barriera').removeClass('visually-hidden');
  $('#barriera').removeClass('disabled');
});