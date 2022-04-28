const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the following as arguments: node mongo.js <password> <name of entry> <number of entry>')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://fsoadmin:${password}@fsocluster0.f5ht2.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(uri)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  entry = new Entry({
    name: name,
    number: number,
  })
  entry.save().then(result => {
    console.log(`added ${result.name} to phonebook with number ${result.number}`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  console.log('Phonebook:')
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name}: ${entry.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the following as arguments: node mongo.js <password> <name of entry> <number of entry>')
  process.exit(1)
}
