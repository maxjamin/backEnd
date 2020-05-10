var express = 	require('express');
var bcrypt = 	require('bcrypt');
var mysql = 	require('mysql');
var jwt =		require('jsonwebtoken');
let config = 	require('../config');

var router = express.Router();

router.post("/", function(req, res)
{

	var username = req.body.username;
	var password = req.body.password;
	var hash = 0;
	var match = 0;  

	var connection = mysql.createConnection({
	host:'localhost',
	user:'newuser1',
	password: 'hostGhostOneMan',
	database: 'phoneApplication'
	})

	console.log('Got body:', req.body);

	//compair the username and against the datbase to return possible user.
	connection.connect();
	connection.query('SELECT username, hashPass FROM users1 WHERE username= "' + username + '";', function(err, rows, fields) {
		
		if(err) throw err;

		if(rows[0] != null)
		{

			hash = rows[0].hashPass;
			console.log('The solution is:s  ', hash)
			connection.end();

			if(bcrypt.compareSync(password, hash))
			{
				console.log("MATCH\n");
				match=1;
			}
			else{
				console.log("NO MATCH")
			}

			console.log("match is ", match);
			
			//send back authorization JWT token
			if(match)
			{
				let token = jwt.sign({username: username},
		          config.secret,
		          { expiresIn: '24h' // expires in 24 hours
		          }
		        );
				res.json({
					success: true,
					message: "authorization successful",
					token: token
				});
			}
			else 
			{
		        res.json({
		          success: false,
		          message: 'Incorrect username or password'
		        });
		      
		    }	
		} else { 
			console.log("No username found")
				res.json({
		        success: false,
		        message: 'Incorrect username or password'
		    });

		}	


	})



})

module.exports = router;