
const Joi = require('joi');
const express = require('express');
const app = express();


// Middleware to parse JSON
app.use(express.json());

// Courses array
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
    { id: 5, name: 'course5' },
];

// Middleware to pretty-print JSON responses
app.set('json spaces', 4);

// Home route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get all courses
app.get('/api/courses', (req, res) => {
    res.json(courses);
});

// Get course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('The course with the searched id was not found');
    }
    res.json(course);
});

// Post a new course
app.post('/api/courses', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body); // Validates the request body
    if (error) {
        return res.status(400).send(error.details[0].message); // Sends detailed error
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


// Update a course by ID
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('The course with the searched id was not found');
    }

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send('Name is required and should be at least 3 characters');
    }

    course.name = req.body.name;
    res.send(course);
});

// Delete a course by ID
app.delete('/api/courses/:id', (req, res) => {
    const courseIndex = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) {
        return res.status(404).send('The course with the searched id was not found');
    }

    const deletedCourse = courses.splice(courseIndex, 1);
    res.send(deletedCourse[0]);
});

// Set the port
const port = process.env.PORT || 2000;

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}...`));
