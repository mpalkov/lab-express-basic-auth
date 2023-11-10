const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const saltRounds = 10;


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
        
        console.log("user found: ", user);
        const isUserPassCorrect = await bcrypt.compare(password, user.password);
        // console.log("pass OK ", isUserPassCorrect);
        if (!user) {
            console.log("NO USER");
            res.render("index", {errorMessage: "User not found"})
        }
        else if (isUserPassCorrect){
            console.log("PASS OK", req.session.currentuser);
            req.session.currentuser = user;
            res.render("index", {user});
        }
        else {
            console.log("Incorrect");
            res.render("auth/login", {errorMessage: "Incorrect user / password"});
        }
    
    }
    catch {
        error => next(error);
    }
});

module.exports = router;