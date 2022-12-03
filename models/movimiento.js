var mongoose= require('mongoose');
var MovimientoSchema=new mongoose.Schema({
    TipoMovimiento:String, //orden de compra, requerimiento, devolucion
    IdMovimiento:String,
    Proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores' },
    FechaEmision:{type: Date, default: Date.now},
    Sucursal:String,
    Transferidos: [{
        Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodProducto: String,
        Codigo:String,
        Sku:String,
        CodigoBarra: String,
        Nombre: String,
        UMedida: String,
        PC:Number,
        EstadoStock: Number, //pendiente, entregado, observado
        Cantidad:Number
    }],
    Observados: [{
        Producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
        CodProducto: String,
        Codigo:String,
        Sku:String,
        CodigoBarra: String,
        Nombre: String,
        UMedida: String,
        Cantidad:Number
    }],
    Estados:[{
        TipoMovimiento:String,
        Estado:Number, //concluido, requerido,transito:"es un estado pendiente"
        Descripcion:String,
        Usuario:String, //administrador
        fecha:Date,
    }], 
    Documentos:[],
    TipoPago:Number,
    Factura:String,
    FechaEntrega:Date,
    CostoTotal:Number,
    MontoMerma:Number, // 0.05%  
    PorcentajeMerma:Number,
    CostesdeEnvio:Number,
    Creador:String,
    fecha: { type: Date, default: Date.now }
});
mongoose.model('Movimientos',MovimientoSchema);