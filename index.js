/**
 * Required External Modules
 */

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require('body-parser');

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();

const authRouter = require("./auth");

/**
 * App Variables
 */

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));


/**
 * Session Configuration
 */

const session = {
    secret: "nagyontitkos",
    cookie: {},
    resave: false,
    saveUninitialized: false
  };
  
if (app.get("env") === "production") {
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true;
}

/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || "http://localhost:5000/callback"
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
  );

/**
 *  App Configuration
 */

const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

/**
 * Routes Definitions
 */

const secured = (req, res, next) => {
    console.log(req.user);
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};  

// Router mounting
app.use("/", authRouter);

app.get("/user", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("user", {
      title: "Profile",
      userProfile: userProfile
    });
  });

////////////////////////////////////////////
// Use demo data
const fs = require("fs");
var users;

// Get user list
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get specific user
app.get('/api/user/:id', (req, res) => {
    if (req.params.id >= users.length) res.send('User not found!');
    res.json(users[req.params.id]);
});

readJSONFile('data/users.json', function (err, json) {
    if (err) { throw err; }
    users = json;
});

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        try {
            console.log("data loaded!");
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}
////////////////////////////////////////////

//Routes
app.use('/api/test', require('./routes/test'));

// Handle other requests
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


const port = process.env.PORT || 5000;
app.listen(port, function () {  
    console.log("App is listening on port", port);
})


