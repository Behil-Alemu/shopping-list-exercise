const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const morgan = require("morgan");
const middleware = require("./middleware.js")
const listRoute = require("./route/list")


app.use(express.json());
app.use(morgan('dev'))

app.use("/items", listRoute);

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found",404);
  
    // pass the error to the next piece of middleware
    return next(err);
  });
  
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
  });
  

module.exports =app;