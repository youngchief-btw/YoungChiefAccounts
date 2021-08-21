const express = require('express');
const app = express();
let jsoning = require('jsoning');
let db = new jsoning("db.json");
const crypto = require("crypto");

app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/views/"));

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started');
});

app.get("/api/register", function(req, res) {
	var reqData = JSON.parse(req.body);
	if (reqData) {
		// Here we are just validating data, and making sure an account is not gonna overwrite an existing one
		if (db.has(reqData.username) === false) {
			// Here we are adding them to the database.
			db.set(reqData.username, {
				"username": reqData.username,
				"password": crypto.createHash("SHA-512").update(reqData.password).digest("hex"),
				"creationTime": Date(),
			});

			var usr = db.get(reqData.username);
			usr.password == null;
			req.send(usr);
		} else {
			// Here we send 403 if the account already exits.
			res.sendStatus(403).send(JSON.stringify({"error": "accountAlreadyExists", "errorMessage": "Account already exists."}));
		}
	}
});

// "accessTokens": [{
// 					"token": "",
// 					"permissions": ["readUsername"]
// 				}]

app.get("/api/login", function(req, res) {
	var reqData = JSON.parse(req.data);
	if (reqData) {
		// We know that by the time we are in this clause, the data isn't just nothingness
		if (reqData.username) {
			if (db.has(reqData.username) === true) {
				// Now we know username exists, but is the password correct?
				if (
					db.get(reqData.username).password === 
					crypto.createHash("SHA-512").update(reqData.password).digest("hex")
				) {
					// Give them access token, adding it to the array of valid access tokens (hash tokens?)
					// db.set(reqData.username.accessTokens[0] === )
				};
			} else {
				res.sendStatus(403).send(JSON.stringify({"error":"invalidCredentials","errorMessage":"Invalid credentials."}));
			}
		} else {
			// change this later
			res.sendStatus(403).send(JSON.stringify({"error":"usernameIsInvalid","errorMessage": "Username is invalid."}))
		}
	}
});