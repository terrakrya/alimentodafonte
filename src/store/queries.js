import axios from 'axios'

var getOrganizations = async function() {
  return await axios.get('organizations').then(async response => {
    return response.data
  })
}

var getProducers = async function() {
  return await axios.get('producers').then(async response => {
    return response.data
  })
}

var getProductVariations = async function() {
  return await axios.get('product_variations').then(async response => {
    return response.data
  })
}

var getUsers = async function() {
  return await axios.get('users').then(response => {
    return response.data
  })
}


var loadList = async function(type) {
  if (type == 'organizations') {
    return await getOrganizations()
  } else if (type == 'producers') {
    return await getProducers()
  } else if (type == 'product_variations') {
    return await getProductVariations()
  } else if (type == 'users') {
    return await getUsers()
  }
}

export default {
  loadList
}
