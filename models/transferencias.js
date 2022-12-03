var mongoose = require('mongoose');
var TransferenciasSchema = new mongoose.Schema({
    CodTransferencia: String,
    Transferidos: [{
        Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodProducto: String,
        CodigoBarra: String,
        Nombre: String,
        UMedida: String,
        EstadoStock: Number
    }],
    Sucursal1: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    Suc1Nombre: String,
    Sucursal2: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    Suc2Nombre: String,
    fecha: { type: Date, default: Date.now },
    Estado: Number,
    fecha2: { type: Date },
    fecha3: { type: Date },
    IdEmisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    NombreEmisor: String,
    IdReceptor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    NombreReceptor: String
});
mongoose.model('Transferencias', TransferenciasSchema)