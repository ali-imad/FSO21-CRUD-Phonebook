import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebookService'
import PhonebookEntryForm from './components/PhonebookEntryForm'
import PhonebookSearchForm from './components/PhonebookSearchForm'
import DataDisplay from './components/DataDisplay'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Enter a name..')
  const [newNumber, setNewNumber] = useState('Enter a number..')
  const [searchObject, setSearchObject] = useState({
    filtered: false,
    param: '',
  })
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameInput = event => {
    setNewName(event.target.value)
  }

  const handleNumberInput = event => {
    setNewNumber(event.target.value)
  }

  const handleSearchInput = event => {
    if (event.target.value === '') setSearchObject({ filtered: false, param: event.target.value })
    else setSearchObject({ filtered: true, param: event.target.value })
  }

  const getPhonebookPromise = () => {
    console.log('getting phonebook..')
    phonebookService.getPhonebook().then(data => {
      console.log('phonebook promise fulfilled')
      setPersons(data.filter(entry => Object.keys(entry).length > 1))
    })
  }

  const handlePhonebookDelete = event => {
    const selected = persons.find(e => {
      return e.id === event.target.value
    })
    if (selected)
      if (window.confirm('Do you really want to delete this entry?')) {
        console.log(`deleting entry id: ${selected.id}`)
        phonebookService.remove(selected.id).then(res => {
          console.log(res)
          setNotification(`${selected.name} has been removed from the phonebook!`)
        })
      }
  }

  const handlePhonebookForm = event => {
    event.preventDefault()
    // create an object for entry to the phonebook
    const entryObject = {
      name: newName,
      number: newNumber,
    }
    const currentEntry = persons.find(e => e.name.toUpperCase() === entryObject.name.toUpperCase())
    if (currentEntry) {
      console.log('update')
      phonebookService
        .update(currentEntry.id, entryObject)
        .then(newObj => {
          console.log('entry updated: ', newObj.id)
          setNotification(`${currentEntry.name} has been updated with a new number!`)
          setNewName('Enter a name')
          setNewNumber('Enter a number')
        })
        .catch(err => {
          console.log(err)
          setErrorMessage(`${currentEntry.name} was already removed from the phonebook!`)
        })
    } else {
      console.log('push')
      phonebookService
        .create(entryObject)
        .then(res => {
          console.log('entry appended: ', entryObject.name)
          setNotification(`${entryObject.name} has been added to the phonebook!`)
          setNewName('Enter a name..')
          setNewNumber('Enter a number..')
        })
        .catch(err => {
          console.log(err.response.data)
          setErrorMessage(`${err.response.data.error}`)
        })
    }
  }

  const resetNotification = () => {
    if (notification !== null) setTimeout(() => setNotification(null), 3000)
    if (errorMessage !== null) setTimeout(() => setErrorMessage(null), 7000)
  }

  // reset notification message
  useEffect(resetNotification, [notification, errorMessage])

  // get teh phonebook entries
  useEffect(getPhonebookPromise, [notification])

  // handle filtering
  const namesToShow = searchObject.filtered
    ? persons.filter(entry => entry.name.toUpperCase().search(searchObject.param.toUpperCase()) > -1)
    : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} isError={true} />
      <Notification message={notification} />
      <div>
        <PhonebookSearchForm searchState={searchObject.param} searchHandler={handleSearchInput} />
      </div>
      {/*
      <div>
        <h4>Debug Panel</h4> 
        <p>Entry field: {newName}: {newNumber}</p> 
        <p>Search field: {searchObject.param} </p>
        <p>isFiltered: {searchObject.filtered}</p>
      </div>
      */}
      <div>
        <PhonebookEntryForm
          nameState={newName}
          numberState={newNumber}
          phonebookHandler={handlePhonebookForm}
          nameHandler={handleNameInput}
          numberHandler={handleNumberInput}
        />
      </div>
      <div>
        <DataDisplay names={namesToShow} deleteHandler={handlePhonebookDelete} />
      </div>
    </div>
  )
}

export default App
