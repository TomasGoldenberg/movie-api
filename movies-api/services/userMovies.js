const Mongolib = require("../lib/mongo");

class UserMoviesService{
    constructor(){
        this.collection= "user-movies";
        this.mongoDB = new Mongolib();
    }

    async getUserMovies({userId}){
        const query = userId ? {userId} : userId;
        const userMovies = await this.mongoDB.getAll(this.collection,query)
        return userMovies || []
    }

    async createUserMovie({userMovie}){
        const createUserMovieId = await this.mongoDB.create(this.collection,userMovie )
        return createUserMovieId
    }

    async deleteUserMovie({userMovie}){
        const deleteUserMovie = await this.mongoDB.delete(this.collection, userMovie);
        return deleteUserMovie
    }
}

module.exports = UserMoviesService;
