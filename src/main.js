const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const compression = require("compression");
const mongoose = require("mongoose");
const session = require("express-session");
const logger = require('morgan');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express();
const PORT = process.env.PORT || 4000;

// logger
app.use(logger('dev'));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static
app.use(express.static('./src/public/images'))

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})


mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("connect db"));


// route preflix
const usersRouter = require('./routes/user_route');
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});


module.exports = app;