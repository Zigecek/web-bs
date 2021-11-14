var socket = io.connect('https://kozohorsky.xyz', {
  reconnect: true
});
socket.on('connect', function() {
    console.log('CONNECTED');
});

socket.on('takeZero', url => {
    window.location.replace(url);
});

socket.emit('getZero');

socket.on('disconnect', function() {
    console.log('DISCONNECTED');
});