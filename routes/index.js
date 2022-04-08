const express = require('express');
const router = express.Router();

const config = require('../config.js');
const sql = require('mysql');

//create one time connections to database
let pool = sql.createPool({
    connectionLimit: 20,
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database,
    port: 8889 //windows 3306
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