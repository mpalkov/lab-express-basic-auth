// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
	if (!req.session.currentuser) {
		return res.render("auth/login", {errorMessage: "Please, log in first"});
	}
	// if user is logged in, proceed
	next();
};

//check if user is logged out
const isLoggedOut = (req, res, next) => {
	if (req.session.currentuser) {
		return res.render("index");
	}
	next();
};

module.exports = {
	isLoggedIn,
	isLoggedOut
};