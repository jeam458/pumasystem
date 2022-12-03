var mongoose = require('mongoose');
var HojaRutaSchema=new mongoose.Schema({
    Conductor:String,
    fecha:Date, //fecha en la que va realizar la ruta
    ruta:[], //ubicaciones gps
    MaterialEntrega:[], //pedidos que va entregar
})

mongoose.model('HojaRutas', HojaRutaSchema);