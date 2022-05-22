const express = require("express");
const router = express.Router();

// ANCHOR Create custom homepage
// --------------------------------------------------
router.get("/", function (req, res, next) {
	const users = req.app.locals.users;

	users
		.find()
		.limit(3)
		.toArray((err, recent) => {
			res.render("index", { recent });
		});
});
// --------------------------------------------------

module.exports = router;
