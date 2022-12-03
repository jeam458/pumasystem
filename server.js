var path = require('path');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');
var multer = require('multer');
var GridFsStorage= require('multer-gridfs-storage');
var Grid= require('gridfs-stream');
Grid.mongo= mongoose.mongo;

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    nombres: String,
    apellidos: String,
    tipo: String,
    fechaInscripcion: { type: Date, default: Date.now },
    celular: Number,
    picture: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

//mongoose.connect(config.MONGO_URI);
/*try {
    console.log("revisando conexion")
    // Connect to the MongoDB cluster
     mongoose.connect(
        config.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }*/
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then (response => {
    console.log ('MongoDB conectado ...')
  })
  .catch (err => console.log (err))
let conn= mongoose.connection;
let gfs//= new  Grid(conn.db, mongoose.mongo);
conn.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
conn.once('open', function() {
    console.log("Connected!")
    gfs = Grid(conn, mongoose.mongo);
    //gfs.collection('uploads');
  });

require('./models/Tareas');
require('./models/Tipos');
require('./models/clientes');
require('./models/proveedores');
require('./models/sucursales');
require('./models/productos');
require('./models/stockProducto');
require('./models/transferencias');
require('./models/Ventas');
require('./models/registros');
require('./models/movimiento');
require('./models/promociones');
require('./models/Ingresos');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
/*app.use((req, res, next) => {
    //res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Origin' , 'https://pulpofront.herokuapp.com');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes);
app.use('/users', users);

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        nombre:user.nombres,
        apellido:user.apellidos,
        tipo:user.tipo,
        email:user.email,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/usuarios', function(req, res, next) {
    User.find(function(err, users) {
        if (err) { return next(err) }
        res.json(users)
    })
})
app.get('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        }
        user.nombres = req.body.nombres || user.nombres;
        user.apellidos = req.body.apellidos || user.apellidos;
        user.tipo = req.body.tipo || user.tipo;
        user.picture = req.body.picture || user.picture;
        user.celular = req.body.celular || user.celular;
        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
        });
    });
});


/*
 |--------------------------------------------------------------------------
 | Log in 
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
    console.log(req.body)
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user || user==undefined) {
            console.log(user)
            return res.status(409).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(409).send({ message: 'Correo electrónico y / o contraseña incorrectos' });
            }
            res.send({ token: createJWT(user) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'el correo electronico ya ha sido tomado' });
        }
        var user = new User({
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            tipo: req.body.tipo,
            celular: req.body.celular,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function() {
            res.send({ token: createJWT(user) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | upload crud
 |--------------------------------------------------------------------------
 */

const storage = new GridFsStorage({
    url: config.MONGO_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
          };
          resolve(fileInfo);
        });
      });
    },
  });
let upload = multer({
    storage
})

// Route for file upload
app.post('/uploadI', (req, res) => {
    console.log("subiendo archivo");
    upload(req,res, (err) => {
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var file = {id:res.req.file.id, originalname: res.req.file.originalname,filename:res.req.file.grid.filename,contentType:res.req.file.grid.contentType};
        res.json({error_code:0, error_desc: null, file_uploaded: true,file:file});
    });
});

// Downloading a single file
app.get('/file/:filename', (req, res) => {
    gfs.collection('ctFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // create read stream
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType)
        // Return response
        return readstream.pipe(res);
    });
});

// Route for getting all the files
app.get('/files', (req, res) => {
    let filesData = [];
    let count = 0;
    gfs.collection('ctFiles'); // set the collection to look up into

    gfs.files.find({}).toArray((err, files) => {
        // Error checking
        if(!files || files.length === 0){
            return res.json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // Loop through all the files and fetch the necessary information
        //console.log(files)
        files.forEach((file) => {
            filesData[count++] = {
                originalname: file.metadata.originalname,
                filename: file.filename,
                contentType: file.contentType,
                _id:file._id
            }
        });
        res.json(filesData);
    });
});


app.delete('/files/:id', (req, res) => {
    console.log(req.params.id);
    //var db = mongoose.connection.db;
    //var mongoDriver = mongoose.mongo;
    //var gfs = new Grid(db, mongoDriver);
    gfs.remove({ _id: req.params.id,root:'ctFiles'}, (err, gridStore) => {
        //console.log(gridStore)
      if (err) {
        return res.status(404).json({ err: err });
      }
      res.json({message:'elemento eliminado'})
      //res.redirect('/');
    });
  });

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
    console.log('Express server escuchando en el puerto ' + app.get('port'));
});