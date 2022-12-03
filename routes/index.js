//import { read } from 'fs';

var express = require('express');
var Request = require('request');
var router = express.Router();

var multiparty = require('connect-multiparty')();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Gridfs = require('gridfs-stream');
const { json } = require('body-parser');

var Tareas = mongoose.model('Tareas');
var Tipos = mongoose.model('Tipos');
var Clientes = mongoose.model('Clientes');
var Proveedores = mongoose.model('Proveedores');
var Sucursales = mongoose.model('Sucursales');
var Productos = mongoose.model('Productos');
var StocksProductos = mongoose.model('StrockProducto');
var Ingresos= mongoose.model('IngresoProducto');
var Ventas = mongoose.model('Ventas');
var Transferencias = mongoose.model('Transferencias');
var Accesos = mongoose.model('Accesos');
var Movimientos= mongoose.model('Movimientos');
var Promociones = mongoose.model('Promociones');



//inicio metodos para las imagenes

router.post('/upload1', multiparty, function(req, res, next) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var writestream = gfs.createWriteStream({
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
    })
    fs.createReadStream(req.files.file.path).pipe(writestream);

    writestream.on('close', function(file) {
        fs.unlink(req.files.file.path, function(err) {
            console.log('success')
        })
    })
})

router.post('/upload/:id', multiparty, function(req, res, next) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var writestream = gfs.createWriteStream({
        filename: req.files.file.name,
        mode: 'w',
        content_type: req.files.file.mimetype,
        metadata: req.body
    })
    fs.createReadStream(req.files.file.path).pipe(writestream);

    writestream.on('close', function(file) {
        Productos.findById(req.params.id, function(err, producto) {
            eliminar(producto.imagen);
            producto.imagen = file._id;
            producto.save(function(err, updateproducto) {
                return res.json(200, updateproducto)
            })
        })
        fs.unlink(req.files.file.path, function(err) {
            console.log('success')
        })
    })
})

router.get('/descargar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    var readstream = gfs.createReadStream({
        _id: req.params.id
    })
    readstream.on('error', function(err) {
        res.send('no existe imagen')
    })
    readstream.pipe(res);
    //console.log(res)

})

function eliminar(id, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: id }, function(err, found) {
        if (err) return { mensaje: "error ocurrido" };
        if (found) {
            gfs.remove({ _id: id }, function(err) {
                if (err) return { mensaje: "error ocurrido" }; { mensaje: "imagen elimnada" };
            })
        } else {
            { mensaje: "no existe imagen con ese id" };
        }
    })
}

router.get('/eliminar/:id', function(req, res) {
    var db = mongoose.connection.db;
    var mongoDriver = mongoose.mongo;
    var gfs = new Gridfs(db, mongoDriver);
    gfs.exist({ _id: re.params.id }, function(err, found) {
        if (err) return res.send("error ocurrido");
        if (found) {
            gfs.remove({ _id: req.params.id }, function(err) {
                if (err) return res.send("error ocurrido");
                res.send("imagen elimnada")
            })
        } else {
            res.send("no existe imagen con ese id");
        }
    })
})


//fin metodos para las imagenes


//GET - Listar todos
router.get('/tareas', function(req, res, next) {
    Tareas.find(function(err, tareas) {
        if (err) { return next(err) }

        res.json(tareas)
    })
})

router.get('/tipos', function(req, res, next) {
    Tipos.find(function(err, tipos) {
        if (err) { return next(err) }
        res.json(tipos);
    })
})

router.get('/clientes', function(req, res, next) {
    Clientes.find(function(err, clientes) {
        if (err) { return next(err) }
        res.json(clientes);
    })
})
router.get('/proveedores', function(req, res, next) {
    Proveedores.find(function(err, proveedores) {
        if (err) { return next(err) }
        res.json(proveedores);
    })
})
router.get('/sucursales', function(req, res, next) {
    Sucursales.find(function(err, sucursales) {
        if (err) { return next(err) }
        res.json(sucursales);
    })
})
router.get('/productos', function(req, res, next) {
    Productos.find(function(err, productos) {
        if (err) { return next(err) }
        res.json(productos);
    })
})
router.get('/stockproductos', function(req, res, next) {
    StocksProductos.find(function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos);
    })
});
router.get('/stockproductosforventas', function(req, res, next) {
    StocksProductos.find({EstadoStock:0},function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos);
    })
});
router.get('/productoxsucursalactivos/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal, EstadoStock:0}, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    }).populate('Producto')
})
router.get('/stockproductoFechas4/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas3/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas2/:sucursal/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas1/:startDate/:endDate', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate } }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas/:startDate/:endDate/:sucursal/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Sucursal: req.params.sucursal, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas5/:startDate/:endDate/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Sucursal: req.params.sucursal }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductoFechas6/:startDate/:endDate/:proveedor', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ fecha: { $gte: req.params.startDate, $lte: req.params.endDate }, Proveedor: req.params.proveedor }, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})
router.get('/stockproductosCount', function(req, res, next) {
    StocksProductos.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/ingresos',function(req,res,next){
    Ingresos.find(function(err,ingresos){
        if (err) { return next(err) }
        res.json(ingresos);
    })
})
router.get('/ingresostock/:id',function(req,res,next){
    Ingresos.find({Stock:req.params.id},function(err,ingresos){
        if (err) { return next(err) }
        res.json(ingresos);
    })
})
router.get('/productoxsucursal/:id', function(req, res, next) {
    StocksProductos.find({ Sucursal: req.params.id}, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos);
    })
})
router.get('/productoxsucursalactivos/:sucursal', function(req, res, next) {
    //console.log(req.params);
    StocksProductos.find({ Sucursal: req.params.sucursal, EstadoStock:1}, function(err, stockproductos) {
        if (err) { return next(err) }
        res.json(stockproductos)
    })
})

router.get('/cantidadingreso/:movimiento',function(req,res,next){
    Ingresos.aggregate({ $match: { Movimiento: req.params.movimiento} },{ $group: { _id: null, cantidad: { $sum: "$Cantidad" } }}, function(err, resp){
        if (err) { return next(err) }
        res.json(resp)
    })
})

router.get('/ventas', function(req, res, next) {
    Ventas.find(function(err, ventas) {
        if (err) { return next(err) }
        res.json(ventas);
    })
})
router.get('/ventasCount', function(req, res, next) {
    Ventas.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/transferencias', function(req, res, next) {
    Transferencias.find(function(err, transferencias) {
        if (err) { return next(err) }
        res.json(transferencias);
    })
})
router.get('/transferenciasCount', function(req, res, next) {
    Transferencias.count(function(err, c) {
        if (err) { return next(err) }
        console.log(c);
        res.json({ conteo: c });
    })
});
router.get('/accesos', function(req, res, next) {
        Accesos.find(function(err, accesos) {
            if (err) { return next(err) }
            res.json(accesos);
        })
    })
router.get('/movimientos',function(req,res,next){ 
    Movimientos.find(function(err,movimientos){
        if(err){return next(err)}
        res.json(movimientos);
    })
})
router.get('/buscarmovimiento/:id',function(req,res,next){ 
    Movimientos.findById(req.params.id,function(err,movimientos){
        Productos.populate(movimientos.Transferidos,{path:'Producto'},function(err,transferidos){
            if(err){return next(err)}
            movimientos.Transferidos=transferidos;
            res.json(movimientos);
        })
    })
})

router.get('/promociones',function(req,res,next){
    Promociones.find(function(err,promociones){
        if(err){return next(err)}
        res.json(promociones);
    })
})
    //POST - Agregar todos
router.post('/tarea', function(req, res, next) {
    var tarea = new Tareas(req.body);
    tarea.save(function(err, tarea) {
        if (err) { return next(err) }
        res.json(tarea);
    })
})

router.post('/tipo', function(req, res, next) {
    var tipo = new Tipos(req.body);
    tipo.save(function(err, tipo) {
        if (err) { return next(err) }
        res.json(tipo);
    })
})
router.post('/cliente', function(req, res, next) {
    var cliente = new Clientes(req.body);
    cliente.save(function(err, cliente) {
        if (err) { return next(err) }
        res.json(cliente);
    })
})
router.post('/proveedor', function(req, res, next) {
    var proveedor = new Proveedores(req.body);
    proveedor.save(function(err, proveedor) {
        if (err) { return next(err) }
        res.json(proveedor);
    })
})
router.post('/sucursal', function(req, res, next) {
    var sucursal = new Sucursales(req.body);
    sucursal.save(function(err, sucursal) {
        if (err) { return next(err) }
        res.json(sucursal);
    })
})
router.post('/producto', function(req, res, next) {
    var producto = new Productos(req.body);
    producto.save(function(err, producto) {
        if (err) { return next(err) }
        res.json(producto);
    })
})

router.post('/stockproducto',function(req,res,next){
    var stock= new StocksProductos(req.body);
    stock.save(function(err,stock){
        if(err){return next(err)}
        res.json(stock)
    })
})


/*function contaar() {
    return StocksProductos.count(function(err, c) {
        if (!err) {
            console.log(c);
            return c;
        }
    });
}*/
router.post('/ingreso',function(req,res,next){
    var ingreso=new Ingresos(req.body);
    ingreso.save(function(err,ingreso){
        if(err){return next(err)};
        res.json(ingreso)
    })
})

function devolvercantidad(){
    
}

//crear stock buscando data anterior y modificando la existente
router.put('/insertstockproducto/:sucursal', function(req, res, next) {
    //console.log(req.body);
    //console.log(req.params.codigo);
    //console.log(req.params.sucursal);
    var stockproducto = new StocksProductos(req.body);
    //console.log(stockproducto);
    var ingresos = new Ingresos(req.body.Ingresos);
    estado={
        TipoMovimiento:'',
        Estado:1,
        Descripcion:'Movimiento concluido',
        Usuario:'',
        fecha:new Date()
     }
    //console.log(ingresos)
    delete stockproducto.Ingresos;
    if(req.body.CodigoBarra!=''){
        //console.log("entrando");
        StocksProductos.find({Codigo:req.body.Codigo,Sucursal:req.params.sucursal,Sku:req.body.Sku,CodigoBarra:req.body.CodigoBarra},function(err,stock){
            if (err) { return next(err) }
            if(stock.length==0){
                stockproducto._doc.Stock=1;
                stockproducto.save(function(err, stockproduc) {
                if (err) { return next(err) }
                ingresos._doc.Stock=stockproduc._id;
                ingresos._doc.Cantidad=1;
                ingresos.save(function(err,ingre){
                    if (err) { return next(err) }
                    res.json({stock:stockproduc, ingreso:ingre});
                })
                });
            } else {
                res.json({message:"producto ya existe"});
            }
        })
    } else {
        StocksProductos.find({Codigo:req.body.Codigo,Sucursal:req.params.sucursal,Sku:req.body.Sku},function(err,stock){
            //console.log(stock)
          if(stock.length==0){
              stockproducto._doc.Stock=ingresos._doc.Cantidad;
              console.log(stockproducto._doc.Stock)
              stockproducto.save(function(err,stockproduc){
                if (err) { return next(err) }
                ingresos._doc.Stock=stockproduc._id;
                ingresos.save(function(err, ingre){
                    if (err) { return next(err) }
                    res.json({stock:stockproduc, ingreso:ingre});
                })
              })
          } else if(stock.length!=0){
              //console.log()
            var respstock=new StocksProductos(stock[0]);
              ingresos.save(function(err,ingre){
                if (err) { return next(err) }
                respstock._doc.Stock=respstock._doc.Stock+ingre.Cantidad;
                respstock.save(function(err,stockprod){
                    if (err) { return next(err) }
                    res.json({stock:stockprod, ingreso:ingre});
                })
              })
          }
        })
    }
    /*StocksProductos.count(function(err,cantidad){
        
        stockproducto.save(function(err, stockproducto) {
            if (err) { return next(err) }
            res.json(stockproducto);
        });
    })*/
});
router.post('/transferencia', function(req, res, next) {
    var transferencia = new Transferencias(req.body);
    transferencia.save(function(err, transferencia) {
        if (err) { return next(err) }
        res.json(transferencia);
    })
})
router.post('/venta', function(req, res, next) {
    var nro;
    var venta = new Ventas(req.body);
    Ventas.count(function(err,cantidad){
        nro=cantidad+1;
        venta.CodVenta='V'+nro;
        venta.save(function(err, venta) {
            if (err) { return next(err) }
            res.json(venta);
        })
    })
})
router.post('/acceso', function(req, res, next) {
    var acceso = new Accesos(req.body);
    acceso.save(function(err, acceso) {
        if (err) { return next(err) }
        res.json(acceso);
    })
})

router.post('/movimiento',function(req,res,next){
    var nro;
    var movimiento = new Movimientos(req.body);
    Movimientos.count(function(err,cantidad){
        nro=cantidad+1;
        movimiento.IdMovimiento='MO'+nro;
        movimiento.save(function(err,acceso){
            if(err){return next(err)}
            res.json(movimiento)
        })
    });
    
})

router.post('/promocion',function(req,res,next){
    var promocion= new Promociones(req.body);
    promocion.save(function(err,promocion){
        if(err){return next(err)}
        res.json(promocion);
    })
})


//PUT - Actualizar todos
router.put('/tarea/:id', function(req, res) {
    Tareas.findById(req.params.id, function(err, tarea) {
        tarea.nombre = req.body.nombre;
        tarea.prioridad = req.body.prioridad;
        tarea.responsable = req.body.responsable;

        tarea.save(function(err) {
            if (err) { res.send(err) }

            res.json(tarea);
        })
    })
})
router.get('/Dni/:dni', function(req, res) {
    Request.get("http://api.grupoyacck.com/dni/" + req.params.dni, function(error, response, body) {
        if (error) { res.send(error) }
        //console.log(body)
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})

router.get('/Ruc/:ruc', function(req, res) {
    //console.log(req.params.ruc)
    Request.get("http://api.grupoyacck.com/ruc/" + req.params.ruc + "/?force_update=1", function(error, response, body) {
        if (error) { res.send(error) }
        var retornar = JSON.parse(body);
        res.json(retornar);
    })
})

router.put('/tipo/:id', function(req, res) {
    Tipos.findById(req.params.id, function(err, tipo) {
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.save(function(err) {
            if (err) { res.send(err) }
            res.json(tipo);
        })
    })
})
router.put('/cliente/:id', function(req, res) {
    Clientes.findById(req.params.id, function(err, cliente) {
        cliente.Tipo = req.body.Tipo;
        cliente.Dni = req.body.Dni;
        cliente.Ruc = req.body.Ruc;
        cliente.Nombre = req.body.Nombre;
        cliente.AP = req.body.AP;
        cliente.AM = req.body.AM;
        cliente.Gerente = req.body.Gerente;
        cliente.Direccion = req.body.Direccion;
        cliente.Referencia = req.body.Referencia;
        cliente.Correo = req.body.Correo;
        cliente.Celular = req.body.Celular;
        cliente.Telefono = req.body.Telefono;
        cliente.Telefono1 = req.body.Telefono1;
        cliente.save(function(err) {
            if (err) { res.send(err) }
            res.json(cliente);
        })
    })
})
router.put('/proveedor/:id', function(req, res) {
    Proveedores.findById(req.params.id, function(err, proveedor) {
        proveedor.tipo = req.body.tipo;
        proveedor.Dni = req.body.Dni;
        proveedor.Ruc = req.body.Ruc;
        proveedor.Nombre = req.body.Nombre;
        proveedor.AP = req.body.AP;
        proveedor.AM = req.body.AM;
        proveedor.Gerente = req.body.Gerente;
        proveedor.Direccion = req.body.Direccion;
        proveedor.Referencia = req.body.Referencia;
        proveedor.Correo = req.body.Correo;
        proveedor.Celular = req.body.Celular;
        proveedor.Telefono = req.body.Telefono;
        proveedor.Telefono1 = req.body.Telefono1;
        proveedor.Estado = req.body.Estado;
        proveedor.save(function(err) {
            if (err) { res.send(err) }
            res.json(proveedor);
        })
    })
})
router.put('/sucursal/:id', function(req, res) {
    Sucursales.findById(req.params.id, function(err, sucursal) {
        sucursal.tipo = req.body.tipo;
        sucursal.Nombre = req.body.Nombre;
        sucursal.Direccion = req.body.Direccion;
        sucursal.Referencia = req.body.Referencia;
        sucursal.Gerente = req.body.Gerente;
        sucursal.Encargado = req.body.Encargado;
        sucursal.Telefono1 = req.body.Telefono1;
        sucursal.Telefono2 = req.body.Telefono2;
        sucursal.save(function(err) {
            if (err) { res.send(err) }
            res.json(sucursal);
        })
    })
})
router.put('/producto/:id', function(req, res) {
    //console.log(req.body);
    Productos.findById(req.params.id, function(err, producto) {
        producto.CodigoBarra = req.body.CodigoBarra;
        producto.tipo = req.body.tipo;
        producto.Codigo = req.body.Codigo;
        producto.Sku=req.body.Sku;
        producto.Nombre = req.body.Nombre;
        producto.Descripcion = req.body.Descripcion;
        producto.Proveedor = req.body.Proveedor;
        producto.Sucursal = req.body.Sucursal;
        producto.Stock = req.body.Stock;
        producto.EstadoStock = req.body.EstadoStock;
        producto.UMedida = req.body.UMedida;
        producto.Faltante = req.body.Faltante;
        producto.Sobrante = req.body.Sobrante;
        producto.PC = req.body.PC;
        producto.PV = req.body.PV;
        producto.Precios=req.body.Precios;
        producto.Estado = req.body.Estado;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})

router.put('/ingreso/:id',function(req,res){
    Ingresos.findById(req.params.id,function(err,ingreso){
        ingreso.Movimiento=req.body.Movimiento;
        ingreso.Cantidad=req.body.Cantidad;
        ingreso.FechaFabricacion=req.body.FechaFabricacion;
        ingreso.FechaVencimiento=req.body.body.FechaVencimiento;
        ingreso.Proveedor=req.body.Proveedor;
    })
})

router.put('/stockproducto/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, stockproducto) {
        stockproducto.Codigo = req.body.Codigo;
        stockproducto.Sku=req.body.Sku;
        stockproducto.CodigoBarra = req.body.CodigoBarra;
        stockproducto.Producto = req.body.Producto;
        stockproducto.Nombre = req.body.Nombre;
        //stockproducto.Proveedor = req.body.Proveedor;
        stockproducto.Sucursal = req.body.Sucursal;
        stockproducto.Stock = req.body.Stock;
        stockproducto.EstadoStock = req.body.EstadoStock;
        stockproducto.UMedida = req.body.UMedida;
        stockproducto.PC = req.body.PC;
        stockproducto.PV = req.body.PV;
        //stockproducto.Ingresos=req.body.Ingresos;
        //stockproducto.Movimiento=req.body.Movimiento;
        //stockproducto.FechaFabricacion= req.body.FechaFabricacion;
        //stockproducto.FechaVencimiento= req.body.FechaVencimiento;
        stockproducto.save(function(err) {
            if (err) { res.send(err) }
            res.json(stockproducto);
        })
    })
})
router.put('/stockproducto1/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, producto) {
        producto.EstadoStock = req.body.EstadoStock;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})
router.put('/stockproductocantidad/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, producto) {
        producto.Stock = req.body.Stock;
        producto.Ingresos=req.body.Ingresos;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})
router.put('/stockproducto2/:id', function(req, res) {
    StocksProductos.findById(req.params.id, function(err, producto) {
        producto.Sucursal = req.body.Sucursal;
        producto.EstadoStock = req.body.EstadoStock;
        producto.save(function(err) {
            if (err) { res.send(err) }
            res.json(producto);
        })
    })
})
router.put('/venta/:id', function(req, res) {
    Ventas.findById(req.params.id, function(err, venta) {
        venta.IdCliente = req.body.IdCliente;
        venta.NombreCliente = req.body.NombreCliente;
        venta.Dni = req.body.Dni;
        venta.RUC = req.body.RUC;
        venta.Telefono = req.body.Telefono;
        venta.Email = req.body.Email;
        venta.IdVendedor = req.body.IdVendedor;
        venta.NombreVendedor = req.body.NombreVendedor;
        venta.NombreSucursal = req.body.NombreSucursal;
        venta.TipoPago = req.body.TipoPago;
        venta.Estado = req.body.Estado;
        venta.Productos = req.body.Productos;
        venta.SubTotal = req.body.SubTotal;
        venta.IGV = req.body.IGV;
        venta.Total = req.body.Total;
        venta.save(function(err) {
            if (err) { res.send(err) }
            res.json(venta);
        })
    })
})
router.put('/transferencia/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.Transferidos = req.body.Transferidos;
        transferencia.Sucursal1 = req.body.Sucursal1;
        transferencia.Suc1Nombre = req.body.Suc1Nombre;
        transferencia.Sucursal2 = req.body.Sucursal2;
        transferencia.Suc2Nombre = req.body.Suc2Nombre;
        transferencia.Cantidad = req.body.Cantidad;
        transferencia.IdEmisor = req.body.IdEmisor;
        transferencia.NombreEmisor = req.body.NombreEmisor;
        transferencia.IdReceptor = req.body.IdReceptor;
        transferencia.NombreReceptor = req.body.NombreReceptor;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia1/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.fecha2 = req.body.fecha2;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia3/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.fecha3 = req.body.fecha3;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/transferencia2/:id', function(req, res) {
    Transferencias.findById(req.params.id, function(err, transferencia) {
        transferencia.Transferidos = req.body.Transferidos;
        transferencia.Estado = req.body.Estado;
        transferencia.save(function(err) {
            if (err) { res.send(err) }
            res.json(transferencia);
        })
    })
})
router.put('/acceso/:id', function(req, res) {
        Accesos.findById(req.params.id, function(err, acceso) {
            acceso.fecha2 = req.body.fecha2;
            acceso.save(function(err) {
                if (err) { res.send(err) }
                res.json(acceso);
            })
        })
    })

router.put('/movimiento/:id',function(req,res){
    Movimientos.findById(req.params.id,function(err,movimiento){
        movimiento.TipoMovimiento=req.body.TipoMovimiento;
        movimiento.Proveedor=req.body.Proveedor;
        movimiento.FechaEmision=req.body.FechaEmision;
        movimiento.Lugar=req.body.Lugar;
        movimiento.Transferidos=req.body.Transferidos;
        movimiento.Estados=req.body.Estados;
        movimiento.Documentos=req.body.Documentos;
        movimiento.TipoPago=req.body.TipoPago;
        movimiento.FechaEntrega=req.body.FechaEmision;
        movimiento.TipoEntrega=req.body.TipoEntrega;
        movimiento.CostoTotal=req.body.CostoTotal;
        movimiento.CostesdeEnvio=req.body.CostesdeEnvio;
        movimiento.MontoMerma=req.body.MontoMerma;
        movimiento.PorcentajeMerma=req.body.PorcentajeMerma;
        movimiento.save(function(err){
            if(err){res.send(err)}
            res.json(movimiento);
        })
    })
})

router.put('/movimientoestados/:id',function(req,res){
    Movimientos.findById(req.params.id, function(err, movimiento){
        movimiento.Estados=req.body.Estados;
        movimiento.save(function(err){
            if(err){res.send(err)}
            res.json(movimiento);
        })
    })
})

router.put('/promocion/:id',function(req,res){
    Promociones.findById(req.params.id,function(err,promocion){
        promocion.NaturalezaPromocion=req.body.NaturalezaPromocion;
        promocion.Sucursales=req.body.Sucursales;
        promocion.ProductosPromocion=req.body.ProductosPromocion;
        promocion.fechaInicio=req.body.fechaInicio;
        promocion.fechaFin=req.body.fechaFin
        promocion.save(function(err){
            if(err){res.send(err)}
            res.json(promocion)
        })
    })
})


    //DELETE - Eliminar todos
router.delete('/tarea/:id', function(req, res) {
    Tareas.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'La tarea se ha eliminado' });
    })
})

router.delete('/tipo/:id', function(req, res) {
    Tipos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el tipo se ha eliminado' })
    })
})
router.delete('/cliente/:id', function(req, res) {
    Clientes.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el cliente fue eliminado' });
    })
})

router.delete('/proveedor/:id', function(req, res) {
    Proveedores.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el proveeedor fue eliminado' })
    })
})
router.delete('/sucursal/:id', function(req, res) {
    Sucursales.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la sucursal fue eliminada' })
    })
})
router.delete('/producto/:id', function(req, res) {
    Productos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el producto fue eliminado' });
    })
})
router.delete('/ingreso/:id',function(req,res){
    Ingresos.findByIdAndRemove(req.params.id,function(err){
        if(err){res.send(err)};
        res.json({ message:'El ingreso fue eliminado' })
    })
})
router.delete('/stockproducto/:id', function(req, res) {
    StocksProductos.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'el stock de producto fue eliminado' });
    })
});
router.delete('/venta/:id', function(req, res) {
    Ventas.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la venta del producto fue eliminada' });
    })
});
router.delete('/transferencia/:id', function(req, res) {
    Transferencias.findByIdAndRemove(req.params.id, function(err) {
        if (err) { res.send(err) }
        res.json({ message: 'la transferencia de los productos fue eliminada' });
    })
});
router.delete('/movimiento/:id',function(req,res){
    Movimientos.findByIdAndRemove(req.params.id,function(err){
        if(err){res.json(err)}
        res.json({message:'movimiento fue eliminado'})
    })
});
router.delete('/promocion/:id',function(req,res){
    Promociones.findByIdAndRemove(req.params.id,function(err){
        if(err){res.json(err)}
        res.json({message:'Promocion fue eliminada'})
    })
});




module.exports = router;