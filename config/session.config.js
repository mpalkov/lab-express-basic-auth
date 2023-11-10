const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = app => {

    app.set("trust proxy", 1);

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: true,
            cookies: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 60000 // 60 * 1000 ms === 1 min
            },
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                ttl: 60000 //ms
            })
        })
    );
};