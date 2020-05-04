//crearemos un server para las pruebas
//ya que estas deben crearse en un servidor diferente al original

const express = require("express")
const supertest = require("supertest")


function testServer(route){
    const app = express()
    route(app)
    return supertest(app)
}

module.exports = testServer;