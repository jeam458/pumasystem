module.exports = {
    TOKEN_SECRET: 'JWT Token Secret',
    /* MONGO_URI:'mongodb://kevin:opensesm@ds035723.mongolab.com:35723/goplanr' */
    //MONGO_URI: 'mongodb://localhost:27017/pulpodb'
    //MONGO_URI:'mongodb+srv://jean458:yandilove387@ventas1.uhv3y.mongodb.net/ventas1?retryWrites=true&w=majority',
    MONGO_URI:'mongodb://jean458:yandilove387@ventas1-shard-00-00.uhv3y.mongodb.net:27017,ventas1-shard-00-01.uhv3y.mongodb.net:27017,ventas1-shard-00-02.uhv3y.mongodb.net:27017/ventas1?ssl=true&replicaSet=atlas-o3xdau-shard-0&authSource=admin&retryWrites=true&w=majority'
};