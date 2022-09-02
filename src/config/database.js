const mongoose = require('mongoose');
// require('dotenv').config({ path: path.resolve(__dirname, '.../.env') })
mongoose.connect('mongodb://localhost:27017/node_curd');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
// aquire the connection (to check if it is successful)
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to Database"));

module.exports = db;