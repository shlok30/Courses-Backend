function getValidationErrors(errors){
    const errorMessages = {}
    Object.keys(errors).forEach(err => errorMessages[err] = errors[err].message)
    return errorMessages
}

module.exports = getValidationErrors