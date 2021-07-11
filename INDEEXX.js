const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require('morgan')
const helmet = require('helmet')
const Joi = require('joi')
//  this return a function we called as express
const logger = require('./logger')

const express = require('express')
// now we need to call express function and store in app by convention
const app = express()

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
  console.log('Authenticating...') //req.body(that middle function parses the req body and if there is json object it will set req.body, then it will pass control to next middle wale function )
  next()
  // next() to pass control to the next middleware function in the pipeline.If you don't do this, you are not termination req, res cycle, our req will end up hanging.
})

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
]

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/api/courses', (req, res) => {
  res.send(courses)
})

/*
app.get('/api/courses/:id', (req, res) => {
  // inorder to read this parameter
  res.send(req.params.id)
})
*/

// get single courses
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  //   This req.params.id return string so comparison krne ke lia parse krna hoga

  if (!course)
    return res.status(404).send('The course with given ID was not found')
  res.send(course)
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body) //result.error

  if (error) {
    // res.status(400).send(result.error)
    res.status(400).send(error.details[0].message)
    return
  }

  // Joi validation
  // const schema = {
  //   name: Joi.string().min(3).required(),
  // }
  // const result = Joi.validate(req.body, schema)
  // // console.log(result)

  // if (result.error) {
  //   // res.status(400).send(result.error)
  //   res.status(400).send(result.error.details[0].message)
  //   return
  // }

  // without package
  // if (!req.body.name || req.body.name.length < 3) {
  //   // 404 Bad request
  //   res.status(400).send('Name is required and should be minimum 3 characters.')
  //   return
  // }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
    // in order to req.body.name to work we need to enable parsing json object in the body of requests because by default this feature is not enable in express so app.use(express.json())
  }
  courses.push(course)
  //   so by convention when we push object to server, when the server create new object we have to return that object in the body of response
  res.send(course)
})

// update
app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // If not exisiting, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  //   This req.params.id return string so comparison krne ke lia parse krna hoga

  if (!course) {
    return res.status(404).send('The course with given ID was not found')
  }

  // Validate
  // if validate, return 400 - Bad request
  // const result = validateCourse(req.body);

  // object destructuring
  // const result = validateCourse(req.body);
  // in curly braces we add property of target object,in this target object has returned from validate course method has two property error and value.  we need only error
  const { error } = validateCourse(req.body) //result.error

  if (error) {
    // res.status(400).send(result.error)
    // res.status(400).send(result.error.details[0].message)
    res.status(400).send(error.details[0].message)
    return
  }
  // Update course
  course.name = req.body.name
  res.send(course)
  // Return the updated course
})

app.delete('/api/courses/:id', (req, res) => {
  // look up the course
  // Not exisitng 404
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  //   This req.params.id return string so comparison krne ke lia parse krna hoga

  if (!course)
    return res.status(404).send('The course with given ID was not found')

  // Delete
  const index = courses.indexOf(course)
  courses.splice(index, 1)
  // Return the same course]
  res.send(course)
})

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  }
  return Joi.validate(course, schema)
}

/*
// multiple parameter in routes
app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.params)
})*/

// query params
/*
app.get('/api/post/:year/:month', (req, res) => {
  res.send(req.query)
  //   http://localhost:3000/api/post/2019/1?sortBy=name
})*/

// PORT
const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
