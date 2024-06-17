const express = require('express');
const router = express.Router();
const mysqlConection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const key = process.env.KEY;
const Token = require('../middlewares/verifyToken');

router.post('/singin', (req, res) => {
    console.log(req.body);
    const {EMAIL, PASSWORD} = req.body
    mysqlConection.query('select id, nombre, apellido, email, rol from user where email = ? and password = ?;', 
    [EMAIL, PASSWORD],
    (err, rows) => {
        console.log(EMAIL, PASSWORD);
        if(!err){
            if(rows.length > 0){
                let data = JSON.stringify(rows[0]);
                const token = jwt.sign(data, key);
                res.json({token});
            }else{
                res.json({
                    message: 'Error: usuario y contraseña invalidos'
                });
            }
        }else{
            res.json({
                message: err
            });
            console.log(err);
        }
    });
});


router.get('/all', Token.Verify, (req, res) => {
    mysqlConection.query('select id, nombre, apellido, email, rol from user',(err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

router.post('/userid', Token.Verify, (req, res) => {
    console.log('este es req ',req.body);
    const {ID} = req.body
    console.log('este es el id user',ID);
    mysqlConection.query('select id, nombre, apellido, email, rol from user where id = ?', 
    [ID],
    (err, rows) => {
        if(!err){
            if(rows.length > 0){
                res.json(rows);
            }else{
                res.json({
                    message: 'No se encontro contactos para este usuario'
                });
            }
        }else{
            res.json({
                message: err
            });
            console.log(err);
        }
    });
});


router.post('/contactos', Token.Verify, (req, res) => {
    console.log('este es req ',req.body);
    const {ID} = req.body
    console.log('este es el ',ID);
    mysqlConection.query('select * from contacto where usuario = ?;', 
    [ID],
    (err, rows) => {
        if(!err){
            if(rows.length > 0){
                res.json(rows);
            }else{
                res.json({
                    message: 'No se encontro contactos para este usuario'
                });
            }
        }else{
            res.json({
                message: err
            });
            console.log(err);
        }
    });
});

router.put('/updateUsuario', Token.Verify, (req, res) => {
   
    const {id, nombre, apellido, email} = req.body; 
    mysqlConection.query('UPDATE user SET nombre=?, apellido=?, email=? WHERE id=?',
        [nombre, apellido, email,id],
        (err, rows, fields) => {
            if (!err) {
                res.json({
                    menssage: 'Se ha modificado con exito'
                });

            } else {
                console.log(err);
            }
        }

    );
    console.log(req.body);
});


router.put('/updateContacto', Token.Verify, (req, res) => {
   
    const {id, numero, email, direccion} = req.body; 
    mysqlConection.query('UPDATE contacto SET numero=?, email=?, direccion=? WHERE id=?',
        [numero, email, direccion, id],
        (err, rows, fields) => {
            if (!err) {
                res.json({
                    menssage: 'Se ha modificado con exito'
                });

            } else {
                console.log(err);
            }
        }

    );
    console.log(req.body);
});

//es un test para verificar la veracidad del token 
router.get('/test', Token.Verify, (req,res)=>{
    res.json('INFORMACION SECRETA');
});




module.exports = router;