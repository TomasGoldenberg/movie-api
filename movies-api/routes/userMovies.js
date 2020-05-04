const express = require("express");
const UserMoviesService = require("../services/userMovies");
const validationHandler = require("../utils/middleware/validationHandler");
const scopeValidationHandler = require("../utils/middleware/scopeValidationHandler");
const{ movieIdSchema} = require("../utils/schemas/movies");
const {userIdSchema} = require("../utils/schemas/users");
const {createUserMovieSchema} = require("../utils/schemas/userMovies");
const passport = require("passport");
require("../utils/auth/strategies/jwt")//JWT STRATEGY

function userMoviesApi(app){
    const router = express.Router();
    app.use("/api/user-movies", router)

    const userMoviesService = new UserMoviesService();
    //GET
    router.get("/",
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["read:user-movies"]),
    validationHandler({userId: userIdSchema}, "query"),
    async function(req,res,next){
        const {userId} = req.query;
        try{
            const userMovies = await userMoviesService.getUserMovies({userId});
            res.status(200).json({
                data:userMovies,
                message: "user movies listed"
            })
        }catch(err){
            next(err)
        }

    })

    //POST
    router.post("/",
     passport.authenticate("jwt",{session:false}),
     scopeValidationHandler(["create:user-movies"]),
     validationHandler(createUserMovieSchema), 
     async function(req,res,next){
          const {body:userMovie}= req;

          try{
            const createdUserMovieId = await userMoviesService.createUserMovie({userMovie})
            res.status(201).json({
                data:createdUserMovieId,
                message: "user movie created"
            })
          }catch(err){
              next(err)
          }
      })

    //DELETE
    router.delete("/:userMovieId",
      passport.authenticate("jwt",{session:false}),
      scopeValidationHandler(["delete:user-movies"]),
      validationHandler({userMovieId:movieIdSchema}, "params"),
      async function(req,res,next){
          const {userMovieId}= req.params;
          
          try{
            const deletedUserMovieId= await userMoviesService.deleteUserMovie({userMovieId})
            res.status(200).json({
                data:deletedUserMovieId,
                message:"user movie deleted"
            })
          }catch(err){
              next(err)
          }
      })
}


module.exports= userMoviesApi