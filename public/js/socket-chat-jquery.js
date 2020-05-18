var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

function renderizarUsuarios(personas) {
    console.log(personas);
    var html = '<li> <a href="javascript:void(0)" class="active" > Chat de <span>' + params.get('sala') + '</span></a > </li>';
    for (let i = 0; i < personas.length; i++) {
        html += '<li> <a data-id="' + personas[i].id + '" href="javascript:void(0)" ><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle" /> <span >' + personas[i].nombre + '<small class="text-success" >online</small ></span ></a > </li>'
    }
    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'light-inverse';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'light-danger';
    }
    if (yo) {
        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-img">';
        html += '        <img src="assets/images/users/1.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-info">';
        html += mensaje.mensaje;
        html += '        </div>';
        html += '    </div>';
        html += '    <div class="chat-time">';
        html += hora;
        html += '    </div>';
        html += '</li>';
    } else {
        html += '<li class="reverse animated fadeIn">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-' + adminClass + '">';
        html += mensaje.mensaje;
        html += '        </div>';
        html += '    </div>';
        html += '    <div class="chat-img">';
        if (mensaje.nombre !== 'Administrador') {
            html += '        <img src="assets/images/users/5.jpg" alt="user" />';
        }
        html += '    </div>';
        html += '    <div class="chat-time">';
        html += hora;
        html += '    </div>';
        html += '</li>';
    }



    divChatbox.append(html);
}

// Listeners
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function (e) {
    e.preventDefault();
    if (!txtMensaje.val().trim()) {
        return;
    }
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function (mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


});