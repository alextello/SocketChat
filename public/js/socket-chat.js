var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('nombre')) {
	window.location = 'index.html';
	throw new Error('El nombre es necesario');
}

var usuario = {
	nombre: params.get('nombre'),
};

socket.on('connect', function () {
	socket.emit('entrarChat', usuario, function (resp) {
		console.log('USUARIOS CONECTADOS', resp);
	});
});

// escuchar
socket.on('disconnect', function () {
	console.log('Perdimos conexión con el servidor');
});

// Enviar información
// socket.emit(
// 	'crearMensaje',
// 	{
// 		usuario: 'Alex',
// 		mensaje: 'Hola Mundo',
// 	},
// 	function (resp) {
// 		console.log('respuesta server: ', resp);
// 	}
// );

// Escuchar información
socket.on('crearMensaje', function (mensaje) {
	console.log(mensaje);
});

// Cuando un usario entra o sale del chat
socket.on('listaPersona', function (personas) {
	console.log(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function (mensaje) {
	console.log('MENSAJE PRIVADO', mensaje);
});
