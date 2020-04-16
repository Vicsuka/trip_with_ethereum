// auth.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");

require("dotenv").config();

/**
 * Routes Definitions
 */

router.get(
    "/login",
    passport.authenticate("auth0", {
        scope: "openid email profile"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/callback", (req, res, next) => {
    console.log(req.complete);
    console.log(req.headers);
    console.log(req.url);
    console.log(req._parsedUrl);
    console.log(req._peername);
    console.log(req.route);
    passport.authenticate("auth0", (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(user);
            console.log("User login error");
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || "/admin/dashboard");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logOut();

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
            process.env.NODE_ENV === "production"
                ? `${returnTo}/`
                : `${returnTo}:${port}/`;
    }

    const logoutURL = new URL(
        util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
    );
    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});

/**
 * Module Exports
 */

module.exports = router;