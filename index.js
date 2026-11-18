require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = process.env.PORT || 3003;

const ClientID = process.env.GOOGLE_CLIENT_ID;
const ClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const CallbackURL = process.env.CALLBACK_URL || "http://localhost:3003/callback";

app.use(passport.initialize());

passport.use(
    new GoogleStrategy(
        {
            clientID: ClientID,
            clientSecret: ClientSecret,
            callbackURL: CallbackURL,
        },
        (accessToken, refreshToken, profile, next) => {
            console.log(accessToken, profile);
            next(null, profile);
        },
    ),
);

app.get("/", (req, res) => {
    res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/failure",
        session: false,
    }),
    (req, res) => {
        console.log(req.user);
        res.send(`Hi ${req.user.displayName}`);
    },
);
app.get("/failure", (req, res) => {
    res.status(401).send("Google authentication failed. Please try again.");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});