const express = require("express");
const app = express()
const {config} = require("./config/index")
const authApi = require("./routes/auth");
const moviesApi= require("./routes/movies")
const usermoviesApi= require("./routes/userMovies");
const {logErrors ,wrapErrors, errorHandler } = require("./utils/middleware/errorHandlers")
const notFoundHandler = require("./utils/middleware/notFoundHandler")
const cors = require("cors")
var bodyParser = require('body-parser')
const helmet = require("helmet")


//MIDDLEWARES
//app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(helmet()) 

//ROUTES
authApi(app)
moviesApi(app)
usermoviesApi(app)

//CATCH 404
app.use(notFoundHandler)

//los middlewares de error siempre deben ir abajo de TODAS las rutas
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)


app.listen(config.port , function(req,res){
    console.log(`Listening in http://localhost:${config.port} `)
})