const express = require("express");
const MoviesService = require("../services/movies")
const {movieIdSchema ,
      createMovieSchema,
      updateMovieSchema,} = require("../utils/schemas/movies")
const validationHandler = require("../utils/middleware/validationHandler")
const scopeValidationHandler = require("../utils/middleware/scopeValidationHandler");
const cacheResponse = require("../utils/cacheResponse")
const passport = require("passport");
require("../utils/auth/strategies/jwt")//JWT STRATEGY
const {FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS} = require("../utils/time")



function moviesApi(app){
    const router = express.Router();
    app.use("/api/movies",router)
    const moviesService = new MoviesService()
    
    
    //LIST
    router.get("/" ,
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["read:movies"]),
    async function(req,res,next){
        cacheResponse(res,FIVE_MINUTES_IN_SECONDS)
        const {tags } = req.query;
        try{
            
            const movies = await moviesService.getMovies({tags})
            console.log(movies)
            res.status(200).json({
                data:movies,
                message:"movies listed"
            })
        }catch(err){
            next(err)
        }
    });


    //READ
    router.get('/:movieId',
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["read:movies"]),
    validationHandler({movieId :movieIdSchema}, "params"), 
    async function(req, res, next) {
        cacheResponse(res,SIXTY_MINUTES_IN_SECONDS)
        const {movieId} = req.params
        try {
          const movies = await moviesService.getMovie({movieId})
            console.log(movies)
          res.status(200).json({
            data: movies,
            message: 'movie retrieved'
          });
        } catch (err) {
          next(err);
        }
      });


    //create
    router.post("/" ,
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["create:movies"]),
    validationHandler(createMovieSchema),
    async function(req,res,next){
        const {body:movie } = req
        try{
            const createMovieId = await moviesService.createMovie({movie})
            console.log(createMovieId)
            res.status(201).json({
                data:createMovieId,
                message:"movies created"
            })
        }catch(err){
            next(err)
        }
    });



    //UPDATE
    router.put("/:movieId",
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["update:movies"]),
    validationHandler({movieId:movieIdSchema}, "params"),
    validationHandler(updateMovieSchema),
    async function(req,res,next){
        const {body:movie }= req;
        const {movieId}= req.params
        try{
            const updateMovieId = await moviesService.updateMovie({movieId,movie})
            res.status(200).json({
                data:updateMovieId,
                message:"movie updated"
            })
        }catch(err){
            next(err)
        }
    });



    //DELETE
    router.delete("/:movieId" ,
    passport.authenticate("jwt",{session:false}),
    scopeValidationHandler(["delete:movies"]),
    validationHandler({movieId: movieIdSchema},"params"),
    async function(req,res,next){
        const {movieId }= req.params
        try{
            const deleteMovieId = await moviesService.deleteMovie({movieId})
            res.status(200).json({
                data:deleteMovieId,
                message:"movies deleted"
            })
        }catch(err){
            next(err)
        }
    });


    //PATCH/FIX
    router.patch("/:movieId", async function(req,res,next){
        const movieId = req.params
        try{
            const fixMovieId = await moviesService.fixMovie({movieId})
            res.status(200).json({
                data: fixMovieId,
                message: "Detail fixed!"
            })
        }catch(err){
            next(err)
        }
    })
}

module.exports= moviesApi