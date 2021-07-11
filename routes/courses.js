const express = require('express');
const router = express.Router();
const Joi = require('joi')
const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
]

// router.get('/', (req, res) => {
//   res.send('Hello World!!!')
// })

router.get('/', (req, res) => {
  res.send(courses)
})

/*
app.get('/api/courses/:id', (req, res) => {
  // inorder to read this parameter
  res.send(req.params.id)
})
*/

// get single courses
router.get('/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  //   This req.params.id return string so comparison krne ke lia parse krna hoga

  if (!course)
    return res.status(404).send('The course with given ID was not found')
  res.send(course)
})

router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  // look up the course
  // Not exisitng return 404
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

module.exports = router;