var mongoose = require('mongoose');
var IngresoProductoSchema = new mongoose.Schema({
    Stock:String,
    Movimiento:String,
    Cantidad: Number,
    FechaFabricacion:Date,
    FechaVencimiento:Date,
    Proveedor: String,
    Creador:String,//notificacion sobre fecha de vencimiento(1 mes, 15 dias)
    fecha: { type: Date, default: Date.now }
});
mongoose.model('IngresoProducto', IngresoProductoSchema);