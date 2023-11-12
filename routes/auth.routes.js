const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {isLoggedIn, isLoggedOut} = require("../middlewares/route-guard");


router.get("/signup", (req, res) => {
    res.render("auth/signup");
})

router.get("/login", (req, res) => {
    res.render("auth/login");
})

router.get("/signup-confirm", (req, res) => {
    return res.render("auth/signup-confirm");
})

router.post("/signup", async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        await User.create({ username, password: hash});
        return res.redirect("/signup-confirm");
        next();
    }
    catch {
        res.send(`<h1>ERROR SIGNNING UP</h1>`);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log("TRYING TO LOG IN", username, password);
        if (username === '' || password === '') {
            res.render("auth/login", {errorMessage: "Please, enter username and password."});
            return;
        }
		console.log("finding user", username);
        const user = await User.findOne({username});
        if (!user) {
			console.log("NO USER");
            return res.render("auth/login", {errorMessage: "User not found"})
        }
        
		console.log("user found: ", user);
        const isUserPassCorrect = await bcrypt.compare(password, user.password);
        // console.log("pass OK ", isUserPassCorrect);
        if (isUserPassCorrect){
            console.log("PASS OK", user);
            req.session.currentuser = user;
            res.render("auth/user", {user});
        }
        else {
            console.log("Incorrect");
            res.render("auth/login", {errorMessage: "Incorrect user / password"});
        }
    git }
    catch {
        error => next(error);
    }
});

router.get("/main", isLoggedIn, (req, res) => {
	res.render("user/main");

});

router.get("/private", isLoggedIn, (req, res) => {
	res.render("user/private");
});

router.get("/logout", isLoggedIn, (req, res) => {
	req.session.destroy(err => {
		if (err) {
			next(err);
		}
		console.log("LOGGED OUT SUCCESSFULY");
		res.redirect("/");
	});
});

module.exports = router;