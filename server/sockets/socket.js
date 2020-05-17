const { io } = require('../server');
const { Usuarios } = require('../classes/usuario');
const { crearMnesaje } = require('../utils/utilidades');

const usuarios = new Usuarios();
io.on('connection', (client) => {
	client.on('entrarChat', (usuario, callback) => {
		if (!usuario.nombre) {
			return callback({
				error: true,
				mensaje: 'El nombre es necesario',
			});
		}
		let personas = usuarios.agregarPersona(client.id, usuario.nombre);
		client.broadcast.emit('listaPersona', usuarios.getPersonas());
		callback(personas);
	});

	client.on('crearMensaje', (data) => {
		let persona = usuarios.getPersona(client.id);
		let mensaje = crearMnesaje(persona.nombre, data.mensaje);
		client.broadcast.emit('crearMensaje', mensaje);
	});

	client.on('disconnect', () => {
		let personaBorrada = usuarios.borrarPersona(client.id);
		client.broadcast.emit(
			'crearMensaje',
			crearMnesaje('Administrador', `${personaBorrada.nombre} salió`)
		);
		client.broadcast.emit('listaPersona', usuarios.getPersonas());
	});

	// Mensajes privados
	client.on('mensajePrivado', (data) => {
		let persona = usuarios.getPersona(client.id);
		client.broadcast
			.to(data.para)
			.emit('mensajePrivado', crearMnesaje(persona.nombre, data.mensaje));
	});
});
