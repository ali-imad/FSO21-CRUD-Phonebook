if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const mongoose = require('mongoose')

// import db models
const Entry = require('./models/entry')

// database connecting
const mongoURI = process.env.mongoURI

console.log(`connecting to: `, mongoURI)
mongoose
  .connect(mongoURI)
  .then(result => {
    console.log('connected to mongoDB')
  })
  .catch(error => {
    console.log(`error connecting to mongoDB: `, error.message)
  })

// express

app.use(express.static('build'))
app.use(express.json()) // allows for use of the express json parser
app.use(cors()) // allow for cross origin resource sharing

// logging
morgan.token('bookEntry', (req, res) => JSON.stringify(req.body))
app.use(
  morgan('tiny', {
    skip: (req, res) => req.method == 'POST',
  }),
)

app.use(
  morgan(':method :url :status -- :response-time ms: :bookEntry', {
    skip: (req, res) => req.method != 'POST',
  }),
)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Entry.find({})
    .then(phonebook => {
      res.json(phonebook)
    })
    .catch(err => next(err))
})

// fetching a single resource from our api
app.get('/api/persons/:id', (req, res, next) => {
  const entryID = req.params.id
  Entry.findById(entryID)
    .then(entry => {
      if (entry) res.json(entry)
      else res.status(404).end() // if the entry doesnt exist, return 404
    })
    .catch(err => next(err))
})

// handle additions through a POST method
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  //  // if these things are missing
  //  if (!body.name || !body.number)
  //    return res.status(400).json({
  //      error: 'name or number missing',
  //    })
  //
  const entry = new Entry({
    name: body.name,
    number: body.number,
  })
  entry
    .save()
    .then(savedEntry => {
      return res.json(savedEntry)
    })
    .catch(err => next(err))
})

// handle updates through a PUT method
app.put('/api/persons/:id', (req, res, next) => {
  const entryID = req.params.id
  const body = req.body

  if (!body.name || !body.number)
    return res.status(400).json({
      error: 'name or number missing',
    })

  Entry.findByIdAndUpdate(entryID, body)
    .then(entry => {
      console.log(`Updated entry ${entry._id}`)
      res.status(204).end()
    })
    .catch(err => next(err))
})

// handle deletions
app.delete('/api/persons/:id', (req, res, next) => {
  const entryID = req.params.id
  Entry.findByIdAndDelete(entryID)
    .then(entry => {
      console.log(`Deleted entry ${entryID}`)
      res.status(204).end()
    })
    .catch(err => next(err))
})

// info page
app.get('/info', (req, res, next) => {
  const currDate = new Date()
  Entry.find({})
    .then(entries => {
      res.send(`
  <div>
    <p>Phonebook has info for ${entries.length} people.</p>
    <p>${currDate.toString()}</p>
  </div>`)
    })
    .catch(err => next(err))
})

// error handler

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
