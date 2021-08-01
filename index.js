require('dotenv').config()

const express = require('express'),
    sequelize =require('./db'),
    models = require('./models/models'),
    cors = require('cors'),
    fileUpload = require('express-fileupload'),
    router = require('./routes/index'),
    errorHandler = require('./middleware/ErrorHandlingMiddleware'),
    path = require('path'),
    app = express(),
    session = require('express-session'),
    cookieParser = require('cookie-parser')




app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        path: '/',
        maxAge: 60000 * 1000
    },
    name: 'SID'
}));

app.use('/api', router)
app.use(errorHandler)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(process.env.PORT, process.env.HOST, ()=> console.log(`Server has been started http://${process.env.HOST}:${process.env.PORT}`))
    }catch (e){
        console.log(e)
    }
}

start()