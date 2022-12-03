var mongoose = require('mongoose');
var ProveedoresSchema = new mongoose.Schema({
    tipo: Number,
    Dni: Number,
    Ruc: Number,
    Nombre: String,
    AP: String,
    AM: String,
    Gerente: String,
    Direccion: String,
    Referencia: String,
    Correo: String,
    Celular: Number,
    Telefono: Number,
    Telefono1: Number,
    Imagen: String,
    Estado: Number,
    fecha: { type: Date, default: Date.now }
});
mongoose.model('Proveedores', ProveedoresSchema);