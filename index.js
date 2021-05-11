const express = require('express')
const pool = require('./db')
const app = express()
const port = process.env.PORT || 8080
var mysql = require('mysql')

app.use(express.json())

/**
 * Funciones para ayudar al servidor a gestionar
 */

function checkPassword(_passRecived,_passBBDD){
    if(_passRecived.toLowerCase()===_passBBDD.toLowerCase()){
        return true;
    }else{
        return false;
    }
}


//GET INFO OF AN USER WITH EMAIL
// ESTE EN PRINCIPIO NO SE USA 
app.get('/users/:email',async(req,res)=>{
    let _userEmail = req.params.email;
    let conn;
    try{
        //establish a connection to MariaDB
        conn = await pool.getConnection();

        //create query
        let query = `select * from usuarios where email_usuario="${_userEmail}"`;

        //execute the query and set the result to a new variable
        let rows = await conn.query(query);

        //return the results
        res.send(rows);
    }catch(err){
        throw err;
    }finally{
        if(conn) return conn.release();
    }
});

//PUT CON RESPUESTA DE CONTRASEÑAS
app.post('/users/login',async(req,res)=>{
    let _userEmail = req.body.email_usuario;
    let _userPass = req.body.password_usuario;
    let conn;
    console.log("llega post login");
    console.log("============================");
    console.log(req.body);
    console.log("============================");
    try{
        conn = await pool.getConnection();

        let query = `select * from usuarios where email_usuario="${_userEmail}"`;

        let rows = await conn.query(query);
        // Si esta registrado se comprueba la contraseña.
        if(checkPassword(_userPass,rows[0].password_usuario)){
            res.status(200).send({auth :  true,"Error" : false, "Message" : "Contraseña correcta!"});
        }else{
            res.status(200).send({auth :  true,"Error" : true, "Message" : "Contraseña incorrecta!"});
        }
    }catch(err){
        // Si el email no esta registrado en la base de datos
        res.status(404).send({auth :  true,"Error" : true, "Message" : "Usuario no registrado"})
        throw err;
    }finally{
        if(conn) return conn.release();
    }
});


//POST USER IN DDBB 
app.post('/users/register',registerUser);

async function registerUser(req,res,next){
    let conn;
    //El body trae en JSON la informacion del formulario generado en el cliente 

                        /*  {
                                "nombre_usuario":"...",
                                "email_usuario":"...",
                                "password_usuario":"..."
                            } */
                            
    console.log("llega post register");
    console.log("============================");
    console.log(req.body);
    console.log("============================");
    let user = req.body;
    try{
        //establish a connection to MariaDB
        conn = await pool.getConnection();

        //create query
        let query = `insert into ??(??,??,??) values (?,?,?)`;
        let tabla = ["usuarios","nombre_usuario","email_usuario","password_usuario",user.nombre_usuario,user.email_usuario,user.password_usuario];
        query = mysql.format(query,tabla);
        
        //execute the query and set the result to a new variable
        await conn.query(query).then(data =>{
            res.status(201).send({auth :  true,"Error" : false, "Message" : "Usuario creado!"});
        }).catch(err => {
            res.status(500).send({
                auth :  true,"Error" : true, "Message" : "Usuario ya registrado con ese correo"});
        })
    }catch(err){
        throw err;
    }finally{
        if(conn) return conn.release();
    }
}

//POST PUNTUACION http://localhost:8080/leaderboard/submit
app.post('leaderboard/submit', async(req,res)=>{
    let conn;
    //El body trae en JSON la informacion del formulario generado en el cliente 

                        /*  {
                                "id_usuario":"...",
                                "puntuacion":"...",
                            } */
                            
    console.log("llega post puntuacion");
    console.log("============================");
    console.log(req.body);
    console.log("============================");
    let puntuacion = req.body;
    try{
        conn = await pool.getConnection();
        let query = `insert into ??(??,??) values (?,?)`;
        let tabla = ["puntuaciones","id_usuario","puntuacion",puntuacion.id_usuario,puntuacion.puntuacion];
        query = mysql.format(query,tabla);

        await conn.query(query).then(data =>{
            res.status(201).send({auth :  true,"Error" : false, "Message" : "Puntuacion guardada!"});
        }).catch(err => {
            res.status(500).send({
                auth :  true,"Error" : true, "Message" : "Error al intentar añadir la puntuacion"});
        })
    }catch(err){
        throw err;
    }finally{
        if(conn) return conn.release();
    }
});


//GET PARA TENER PUNTUACIONES http://localhost:8080/leaderboard

app.get("/", (req,res)=>{
    res.send("hola mundo");
});

app.listen(port,() => console.log(`listening on port ${port}`));