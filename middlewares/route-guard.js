// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
	if (!req.session.currentuser) {
		console.log("route-guard: User not logged in");
		return res.redirect("/login");
	}
	// if user is logged in, proceed
	console.log("route-guard: User logged in, proceeding to next();");
	next();
};

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