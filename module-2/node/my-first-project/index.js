const axios = require('axios')

axios.get('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.error(error)
    })