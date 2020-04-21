/**
 * Required External Modules
 */

const express = require('express');
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require('body-parser');
const expressSession = require("express-session");

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const authRouter = require("./auth");

const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');


require("dotenv").config();



/**
 * App Variables
 */

const app = express();
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const isProduction = app.get("env") === "production";

app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**
 * Session Configuration
 */

const session = {
  secret: "nagyontitkos",
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
};

app.use(expressSession(session));

// if (isProduction) {
//     // Serve secure cookies, requires HTTPS
//     session.cookie.secure = true;
// }

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
  function (accessToken, refreshToken, extraParams, profile, done) {
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
 *  App Configuration
 */

const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));

/**
 *  Mongoose Configuration
 */

autoIncrement.initialize(mongoose.connection);
mongoose.set('useCreateIndex', true);

if(!isProduction){
  mongoose.set('debug', true);
}

require('./models/Email/Email');
require('./models/User/User');

/**
 * Routes Definitions
 */

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

// Router mounting
app.use("/", authRouter);

// Secured routes
// If in production mode, protect access
if (isProduction) {
  app.use('/admin', secured);
  app.use('/api', secured, require('./routes/api'));
} else {
  app.use('/api', require('./routes/api'));
}


// Handle other requests
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})


/**
 * Error handlers
 */

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});






const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("App is listening on port", port);
})


