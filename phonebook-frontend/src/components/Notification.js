import React from 'react'

const Notification = ({ message, isError }) => {
    const errorStyle = {}

    if (message === null) return null
    if (isError)
        errorStyle.color = 'red'

    return (
        <div className="notification" style={errorStyle}>
            {message}
        </div>
    )
}

export default Notification
