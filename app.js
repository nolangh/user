const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// New stuff to add
//---------------------------------------------------
const hbs = require("hbs");
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const authUtils = require("./utils/auth");
const session = require("express-session");
const flash = require("connect-flash");
// --------------------------------------------------

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Add new routes
// --------------------------------------------------
const authRouter = require("./routes/auth");
// --------------------------------------------------

const app = express();

//--------------------------------------------------------------------------------

// ANCHOR Mongo client connection
MongoClient.connect(
	"mongodb+srv://nolangh:nosyad55@cluster0.g6tox.mongodb.net/?retryWrites=true&w=majority",
	(err, client) => {
		if (err) {
			throw err;
		}

		const db = client.db("user-profiles");
		const users = db.collection("users");
		app.locals.users = users;
	}
);

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
hbs.registerPartials(path.join(__dirname, "views/partials"));
// --------------------------------------------------

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ANCHOR Configure session, passport, flash
// --------------------------------------------------
app.use(
	session({
		secret: "session secret",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
	res.locals.loggedIn = req.isAuthenticated();
	next();
});
// --------------------------------------------------

app.use("/", indexRouter);
app.use("/users", usersRouter);

// ANCHOR Add new routes
// --------------------------------------------------
app.use("/auth", authRouter);
// --------------------------------------------------

// ANCHOR catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// ANCHOR error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// ANCHOR render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
