const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const saltRounds = 10;


router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

router.get("/signup-confirm", (req, res) => {
    res.render("auth/signup-confirm");
})

router.post("/signup", async (req, res) => {
    try {
        const {username, password} = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        await User.create({ username, password: hash});
        res.redirect("/signup-confirm")
    }
    catch {
        res.send(`<h1>ERROR SIGNNING UP</h1>, ${error}`);
    }
});

module.exports = router;