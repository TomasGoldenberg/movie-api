const express = require('express');
const passport = require("passport");
const boom = require("@hapi/boom");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const { config } = require('./config/index');
const cors = require("cors")
require("./utils/auth/strategies/basic");//BASIC STRATEGY
require("./utils/auth/strategies/oauth");//OAUTH STRATEGY
const helmet = require("helmet")



const app = express();

// body parser
app.use(cors({credentials: true, origin: 'localhost:8000'}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet())




//SIGN-IN/SIGN-UP

app.post("/auth/sign-in", async function(req, res, next) {
  passport.authenticate("basic", function(error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async function(error) {
        if (error) {
          next(error);
        }

        const { token, ...user } = data;

        if (!config.dev) {
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
          });
        } else {
          res.cookie("token", token,{withCredentials:true});
        }

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async function(req, res, next) {
  const { body: user } = req;

  try {
    await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: "post",
      data: user
    });

    res.status(201).json({ message: "user created" });
  } catch (error) {
    next(error);
  }
});

//MOVIES
app.get("/movies", async function(req, res, next) {});

//USERMOVIES
app.post("/user-movies", async function(req, res, next) {
  
  try {
    const { body: userMovie } = req;
    const { token } = req.cookies;

    console.log(token)
    console.log(userMovie)

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: "post",
      data: userMovie,
      withCredentials:true
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete("/user-movies/:userMovieId", async function (req, res, next) {
  try{

    const {userMovieId}= req.params;
    const {token}= req.cookies;


    const {data,status}= await axios({
      url:`${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: {Authorization: `Bearer ${token}`},
      method:"delete",
      withCredentials:true

    })

    if(status !== 200){next(boom.badImplementation())}

    res.status(200).json(data)
  }catch(err){
    next(err)
  }
});

//GOOGLEAUTH
//ruta de validacion
app.get("/auth/google-oauth",passport.authenticate("google-oauth",{scope:["email","profile","openid"]}));

//ruta de callback de validacion
app.get("/auth/google-oauth/callback",
        passport.authenticate("google-oauth",{session:false}),
        function(req,res,next){
          if(!req.user){next(boom.unauthorized("no user defined"))}

          const{token ,...user}= req.user;
          res.cookie("token",token,{
            httpOnly:!config.dev,
            secure:  !config.dev,
            withCredentials:true
          })

          res.status(200).json(user)
        });




app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});