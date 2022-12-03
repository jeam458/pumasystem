var mongoose = require('mongoose');
var VentasSchema = new mongoose.Schema({
    tipo:Number, //vent directa, nota de pedido a almacen
    CodVenta:String,
    NroFactura: Number,
    IdCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes' },
    NombreCliente: String,
    Dni: Number, //buscadores
    RUC: Number, //buscadores
    Telefono: String,
    Email: String,
    IdVendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    NombreVendedor: String,
    IdSucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' },
    NombreSucursal: String,
    fecha: { type: Date, default: Date.now },
    TipoPago: Number,
    Estados:[{
        Estado:String, //concluido, cancelado, suspendido
        Descripcion:String,
        Usuario:{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' }, //administrador
        fecha:Date,
    }],
    Estado: Number, 
    FechaEntrega:Date,
    ConfirmacionEntrega:Number,
    Productos: [{
        Codigo: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodigoBarra: String,
        CodProducto:String,
        Nombre: String,
        Cantidad: Number,
        UMedida: String,
        PrecioUnitario: Number,
        PrecioTotal: Number
    }],
    Bonificaciones: [{
        Codigo: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodigoBarra: String,
        CodProducto:String,
        Nombre: String,
        Cantidad: Number,
        UMedida: String,
        PrecioUnitario: Number, //costo por promocion
        PrecioTotal: Number 
    }],
    Documentos:[], //las facturas que se genera por la venta
    EstadoDevolucion:Number,
    MontoMerma: Number, //0.05%
    SubTotal: Number,
    IGV: Number,
    Total: Number
});
mongoose.model('Ventas', VentasSchema)