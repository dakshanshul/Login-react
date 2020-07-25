const express = require('express');
const app     = express();
const path    = require('path');
const postgre = require('pg');
const session = require('express-session');
const PGStore = require('express-pg-session')(session);
const Router  = require('./Router');

app.use(express.static(path.join(__dirname,'build')));
app.use(express.json());

// Database 
// const { Client } = require('pg');

// const client = new Client({
//     user: 'anshul',
//     host: 'localhost',
//     database: 'nodelogin',
//     password: '1234',
//     port: 5432,
// });

// client.connect(function(err) {

//         if (err) {
//             console.log('DB error');
//             throw err;
//             return false;
//         }


//     });


const { Client } = require('pg');
const connectionString = 'postgres://postgres:1234@localhost:5432/logindb'

const client = new Client ({

    connectionString:connectionString
});

client.connect(function(err) {
    if(err){
         console.log('DB error');
         throw err;

    }
});

const sessionStore = new PGStore({
    expiration: (1825*86400*1000),
    endConnectionOnClose: false ,
}, client );

// client.query('select * from users' ,(err,res)=>{
//     console.log(err,res)
//     client.end()
// })

app.use(session({
    key:'abcd',
    secret:'12345',
    store: sessionStore,
    saveUninitialized: false,
    resave:  false,
    cookie:{
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false 
    }
}))





new  Router(app , client );

app.get('/' , function(req,res) {
    res.sendFile(path.join(__dirname,'build','index.html'));
});


app.listen(3000);
 