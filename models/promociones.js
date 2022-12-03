var mongoose = require('mongoose');
var PromocionesSchema = new mongoose.Schema({
    NaturalezaPromocion:String, //mayoristas, minoristas, ambos
    Sucursales: [], //sucursales donde aplica la promoción
    ProductosPromocion:
    [{
        Codigo: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' }, //codigo generado en tipo producto por la bd
        Nombre: String, //nombre referencial
        CantidadxPromocion: Number, //minimo numero de compras
        UMedida: String, //unidad de media para aplicar promocion
        PrecioUnitario: Number, //costo por promocion
    }],
    fechaInicio:Date,
    fechaFin:Date   //trigger para repotenciar el area de ventas (notificacion por correo)
});
mongoose.model('Promociones', PromocionesSchema);