import React from "react"

const PhonebookSearchForm = (props) => {
    const {searchState, searchHandler } = props
  
    return (
      <>
        <p>Find names containing: <input value={searchState} onChange={searchHandler}></input></p>
      </>
    )
}

export default PhonebookSearchForm