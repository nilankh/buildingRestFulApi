const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet')
const Joi = require('joi')
//  this return a function we called as express
const logger = require('./middleware/logger')
const courses = require('./routes/courses')
// loading the express module. this returns a function so we store in variable callled express
const express = require('express')
// now we need to call express function and its return object of type express and by covention we call the object app by convention, this represntr our application
const app = express()// this app object has bunch of useful method

// Environment
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

app.use(express.json())
// when we call express.json() method, this method returns a function, a middleware function, the job of this middleware function is to read the request, and if there is json object in the body of the request, it will parse the body of the request, into json object and then it will set to the req.body property.

app.use(express.urlencoded({ extended: true }))
// when we call express.urlencoded() method,this method return  a function a middleware function, this middleware function parses incoming request with urlencoded payloads, that is req with body like this key=value&key=value

app.use(express.static('public'))
// it is use to serve static files, passed a folder called public.We will put all our static assets like css, images and so on inside this folder.
app.use(helmet())
app.use('/api/courses', courses)

// Configuration
console.log('Application Name: ' + config.get('name'))
console.log('Mail Server: ' + config.get('mail.host'))
console.log('Mail Password: ' + config.get('mail.password'))

// app.use(morgan('tiny'))
// enable loggng http request only on development macchine
if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
  // console.log('Morgan enabled')
  startupDebugger('Morgan enabled')
}

// Db work...
dbDebugger('Connected to the database..')
// to set on production set NODE_ENV = production write on terminal

// Custom middleware function
// app.use(function(req, res, next) {
//   console.log("Logging...");
//   next();
//   // next() to pass control to the next middleware function in the pipeline.If you don't do this, you are not termination req, res cycle, our req will end up hanging.
// });
app.use(logger)
app.use(function (req, res, next) {
  console.log('Authenticating...')
  next()
  // next() to pass control to the next middleware function in the pipeline.If you don't do this, you are not termination req, res cycle, our req will end up hanging.
})

// PORT
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
