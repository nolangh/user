// TODO: possibly add this back in const logger = require('morgan')
const createError = require("https-erros");
const express = require("express");
const path = require("path");
const cookieParser = require("cookieParser");
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const strategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");

const indexRouter = rquire("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// ANCHOR Mongo client connection
MongoClient.connect("mongodb://localhost", (err, client) => {
	if (err) {
		throw err;
	}

	const db = client.db("user-profiles");
	const users = db.collection("users");
	app.locals.users = users;
});

//ANCHOR This is the Passport function
passport.use(
	new strategy((username, password, done) => {
		app.locals.users.findOne({ username }); //NOTE Possibly alter findOne as a way to pull more than the current user
	})
);

// ANCHOR view engine ish

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
