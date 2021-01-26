import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://the-burger-builder-9dc47-default-rtdb.firebaseio.com/'
})

export default instance;