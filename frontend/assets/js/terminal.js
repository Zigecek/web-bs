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
    term.clear();
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
    if ($('#host').val() == 'rpi') {
      socket.on('sendHost', hostInfo => {
        socket.emit('hostname', { pswd: $('#pswd').val(), usr: $('#usr').val(), port: hostInfo.port, host: hostInfo.host });
      });
      socket.emit('getHost');
    } else {
      socket.emit('hostname', { pswd: $('#pswd').val(), usr: $('#usr').val(), port: $('#port').val(), host: $('#host').val() });
    }
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

$(document).ready(function(){
    $(".txtar").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      $('#btn-login').click();
      $('#btn-login').focus();
    }
});
});

function fitit(){
  fituj.fit();
}

window.addEventListener('resize', fitit);