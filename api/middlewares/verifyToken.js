const jwt = require('jsonwebtoken');
const key = process.env.KEY;

function Verify(req,res,next){

    let tokenV = req.headers['x-access-token'] || req.headers['authorization'];
    //console.log(tokenV);
    if(!tokenV){
        res.status(401).send({
            error: 'Es necesario un token de autentificacioin'
        })
        return;
    }

    if(tokenV.startsWith('Bearer ')){
        tokenV = tokenV.slice(7, tokenV.length);
        console.log(tokenV)
    }
    if(tokenV){
        jwt.verify(tokenV, key,(error,decoded)=>{
            if(error){
                return res.json({
                    message: 'El token no es valido'
                });
            }else{
                res.decoded = decoded;
                next();
            }
        });
    }

}

module.exports = {
    Verify: Verify
};