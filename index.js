const Joi = require('joi')
//  this return a function we called as express
const express = require('express')
// now we need to call express function and store in app by convention
const app = express()

app.use(express.json())

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

  if (!course) res.status(404).send('The course with given ID was not found')
  res.send(course)
})

app.post('/api/courses', (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  }
  const result = Joi.validate(req.body, schema)
  // console.log(result)

  if (result.error) {
    // res.status(400).send(result.error)
    res.status(400).send(result.error.details[0].message)
    return
  }
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
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
