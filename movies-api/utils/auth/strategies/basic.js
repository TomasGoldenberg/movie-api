const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const {UsersService}= require("../../../services/users");


passport.use(new BasicStrategy(async function(email,password,cb){
    const userService = new UsersService();

    try{
        const user = await userService.getUser({email})
        if(!user){//si no existe el user devolvemos no autorizado
            return cb(boom.unauthorized(),false)
        }

        //si la password que introdujimos no es igual a la del user en DB devolvemos no autorizado
        if(!(await bcrypt.compare(password, user.password))){
            return cb()(boom.unauthorized(),false)
        }

        //si llegamos hasta aca significa que esta autorizado
        delete user.password //la eliminamos del alcance de 3eros

        return cb(null, user)//devolvemos el usuario|| el null es que el error en null osea que no hay error
    }catch(err){
        return cb(err)
    }
}))

