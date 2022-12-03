var mongoose = require('mongoose');
var SucursalesSchema = new mongoose.Schema({
    tipo: Number,
    Nombre: { type: String, unique: true },
    Direccion: String,
    Referencia: String,
    Gerente: String,
    Encargado: String,
    Telefono1: Number,
    Telefono2: Number,
    fecha: { type: Date, default: Date.now }
});
mongoose.model('Sucursales', SucursalesSchema);