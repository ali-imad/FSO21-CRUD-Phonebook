
const PhonebookEntryForm = ({ nameState, numberState, phonebookHandler, nameHandler, numberHandler}) => {
    return (
      <>
      <h2>Add an entry</h2>
      <form onSubmit={phonebookHandler}>
        <div>
          Name: <input value={nameState} onChange={nameHandler}/>
        </div>
        <div>
          Phone Number: <input value={numberState} onChange={numberHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      </>
    )
}

export default PhonebookEntryForm