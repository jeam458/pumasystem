var mongoose = require('mongoose');
var StockProductoSchema = new mongoose.Schema({
    Codigo: String,
    Sku: String,
    CodigoBarra: String,
    Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
    Nombre: String,
    Sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    Stock: Number,
    EstadoStock: Number,
    UMedida: String,
    PC: Number,
    PV: Number,
    /*Ingresos:[{Movimiento:String,
               Cantidad: Number,
               FechaFabricacion:Date,
               FechaVencimiento:Date,
               Proveedor: String,
               Creador:String}],*///notificacion sobre fecha de vencimiento(1 mes, 15 dias)
    fecha: { type: Date, default: Date.now }
});
mongoose.model('StrockProducto', StockProductoSchema);