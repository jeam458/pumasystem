var mongoose = require('mongoose');
var ProductosSchema = new mongoose.Schema({
    Sku:String,
    Codigo: String,
    tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipos' },
    Nombre: String,
    Descripcion: [{ Caracteristica: { type: String }, Descripcion: { type: String } }],
    Precios:[{UMedida:String,Cantidad:Number,PV:Number}],
    //Proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores' },
    //Sucursal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales' }],
    //Stock: Number,
    //EstadoStock: Number,
    UMedida: String,
    //Faltante: Number,
    //Sobrante: Number,
    PC: Number,
    PV: Number,
    Estado: Number,
    imagen: String,
    fecha: { type: Date, default: Date.now }
});
mongoose.model('Productos', ProductosSchema)