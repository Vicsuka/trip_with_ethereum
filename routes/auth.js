// auth.js

/**
 * Required External Modules
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const querystring = require("querystring");

var userUtils = require('../models/User/UserUtils');

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
    passport.authenticate("auth0", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // Save user to our own db if doesn't exist
            
            let userData = {
                auth0id: user.id,
                firstname: user.name.givenName,
                lastname: user.name.familyName,
                username: user.nickname,
                email: user._json.email,
                picture: user.picture,
                locale: user.locale
            };
            console.log("Checking if user exits: ");
            userUtils.userExists(user.id, userData);

            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || "/admin/myprofile");
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