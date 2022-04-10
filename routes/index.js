const express = require('express');
const router = express.Router();
const config = require('../config.js');
const sql = require('mysql');
//add some middleware to parse out the post req data
router.use(express.json());
router.use(express.urlencoded({ 'extended' : false }));
 
//create one time connections to database
let pool = sql.createPool({
    connectionLimit: 20,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database,
    port: 8889 //windows 3306
  })  

  //:text is like a parameter
  //dynamic route parameter
  router.post('/getone', (req, res) => {
    //console.log(req.params.user);
    //console.log(`hit the user route: the user is ${req.params.user}`);

    pool.getConnection((err, connection) => {
      if (err) throw err;

      let currentUser = req.body;
      loginResult = {};

      let query = `SELECT first_name, password FROM user WHERE first_name="${currentUser.username}"`;

      connection.query(query, (err, user) => {
        connection.release();

        if (err) throw err;

        //check if the user exists
        if (!user[0]) {
          loginResult.action = "add";
          //if yes, checck password
        } else if (user[0].password !== currentUser.password) {
          loginResult.field = 'password';
          loginResult.action = 'retry'
        }  else {
          loginResult.message = 'authenticated';
        }

        //send back the login reqest - pass or fail
        res.json(loginResult);
      })
    })
  })

  router.post('/signup', (req, res) => {
    console.log('hit add user route');

    let user = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        let query = `INSERT INTO user(first_name, last_name, password, role, permissions, avatar) VALUES('${user.username}', 'test', '${user.password}', 0, 3, '')`;

        connection.query(query, (err, result) => {
            connection.release();

            if (err) throw err;

            console.log(result);

            res.json({action: 'added'});
        })
    })
  })

  //route to match user
  router.get('/getall', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
    //run a query and get results and errors
    connection.query('SELECT * FROM user', function(error, results) {
      //resleases connecction back into pool
      connection.release();
      if (error) throw error;

      //edit the to remove password
      results.forEach(result => {
          delete result.password;
          delete result.last_name;

          if (!result.avatar) {
            result.avatar = "temp_avatar.jpg";
          }
      })

      //log the data to terminal
      console.log(results);
      res.json(results);
    })
  })
  })

  module.exports = router;