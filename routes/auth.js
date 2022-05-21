const express = require("express");
const router = express.Router();
const authUtils = require("../utils/auth");
const passport = require("passport");
const flash = require("connect-flash");
//----------------------------------------

//ANCHOR Login page
router.get("/login", (req, res, next) => {
	const message = req.flash();
	res.render("login", { message });
});
//-------------------------------------------------

//ANCHOR Handles the login request
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/auth/login",
		failureFlash: "Wrong username of password",
	}),
	(req, res, next) => {
		res.redirect("/users");
	}
);

//---------------------------------------------------------

//ANCHOR  Registration page
router.get("/register", (req, res, next) => {
	const message = req.flash();
	res.render("register", { message });
});

//-------------------------------------------------------------------

//ANCHOR Handle register request

router.post("/register", (req, res, next) => {
	const registrationParams = req.body;
	const users = req.app.locals.users;
	const payload = {
		username: registrationParams.username,
		password: authUtils.hashPassword(registrationParams.password),
	};

	users.insertOne(payload, (err) => {
		if (err) {
			req.flash("error", "User account already exists.");
		} else {
			req.flash("success", "User account registered successfully.");
		}

		res.redirect("/auth/register");
	});
});
// --------------------------------------------------

// Logout page
// --------------------------------------------------
router.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.redirect("/");
});

module.exports = router;
