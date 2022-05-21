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
const { hasSubscribers } = require("diagnostics_channel");

const app = express();

//--------------------------------------------------------------------------------

// ANCHOR Mongo client connection
MongoClient.connect("mongodb://localhost", (err, client) => {
	if (err) {
		throw err;
	}

	const db = client.db("user-profiles");
	const users = db.collection("users");
	app.locals.users = users;
});

//------------------------------------------------------------------

//ANCHOR This is the Passport function
passport.use(
	new Strategy((username, password, done) => {
		app.locals.users.findOne({ username }, (err, user) => {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false);
			}

			if (user.password != authUtils.hashPassword(password)) {
				return done(null, false);
			}

			return done(null, user);
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	done(null, { id });
});

// -----------------------------------------------------

// ANCHOR view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//-----------------------------------------------------

// ANCHOR partials for HandleBars
