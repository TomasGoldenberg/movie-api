const assert = require("assert")
const buildMessage = require("../utils/buildMessage")

describe.only("utils - buildMessage",function(){
        describe("when recieves an entity and an action",function(){
            it("should return the respective message", function(){
                const result = buildMessage("movie", "create");
                const expected = "movie created"
                assert.strictEqual(result ,expected)
            })
        })


        describe("when recieves an entity,action and is a list",function(){
            it("should return the message and entity in plural",function(){
                const result = buildMessage("movie" ,"list")
                const expected = "movies listed";
                assert.deepEqual(result,expected)
            })
        })
} )