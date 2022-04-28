import axios from 'axios'
const baseURL = '/api/persons' // comment in dev
//const baseURL = 'http://localhost:3001/persons' // comment in prod

const getPhonebook = () => {
  const request = axios.get(baseURL)
  return request.then(res => res.data)
}

const create = newEntry => {
  const request = axios.post(baseURL, newEntry)
  return request.then(res => res.data)
}

const remove = id => {
  return axios.delete(`${baseURL}/${id}`)
}

const update = (id, newEntry) => {
  const request = axios.put(`${baseURL}/${id}`, newEntry)
  return request.then(res => res.data)
}

const phonebookService = { getPhonebook, create, remove, update }

export default phonebookService
