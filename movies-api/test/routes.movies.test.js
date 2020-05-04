const assert = require("assert")//es el modulo nativo que nos permite ver si es cierta nuestra compraracion esperada con la de los test
const proxyquire = require("proxyquire")

const {moviesMock, MoviesServiceMock} = require("../utils/mocks/movies")
const testServer = require("../utils/testServer")


describe("routes - movies" , function(){
    const route = proxyquire("../routes/movies",{
        "../services/movies" : MoviesServiceMock
    })
    const request = testServer(route)

    describe("GET /movies", function(){
        it("should respond with status 200", function(done){
            request.get("/api/movies").expect(200,done)
        })


        it("should respond with the list of the movies",function(done){
            request.get("/api/movies").end((err,res) =>{
                assert.deepEqual(res.body , {
                    data: moviesMock,
                    message: "movies listed"
                })

            done()
            })
        })
    })
})