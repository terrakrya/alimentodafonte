import axios from 'axios'

var getSeeds = async function() {
  return await axios.get('seeds').then(async response => {
    return response.data
  })
}

var getCollectors = async function() {
  return await axios.get('users', {
    params: {
      role: 'collector'
    }
  }).then(response => {
    return response.data
  })
}

var getClients = async function() {
  return await axios.get('users', {
    params: {
      role: 'client'
    }
  }).then(response => {
    return response.data
  })
}

var getUsers = async function() {
  return await axios.get('users').then(response => {
    return response.data
  })
}

var getCollectorsGroups = async function() {
  return await axios.get('collectors_groups').then(response => {
    return response.data
  })
}

var getSeedsHouses = async function() {
  return await axios.get('seeds_houses').then(response => {
    return response.data
  })
}

var getStock = async function() {
  return await axios.get('stock').then(async response => {
    return response.data.map(stock_movement => {
      stock_movement.type = stock_movement.out_mode ? 'stock_out' : 'stock_in'

      if (stock_movement.qtd && stock_movement.type == 'stock_out' && stock_movement.qtd > 0) {
        stock_movement.qtd = stock_movement.qtd * -1
      }

      return stock_movement
    }).sort((a, b) => a.createdAt < b.createdAt )
  })
}

var loadList = async function(type) {
  if (type == 'collectors') {
    return await getCollectors()
  } else if (type == 'collectors_groups') {
    return await getCollectorsGroups()
  } else if (type == 'seeds_houses') {
    return await getSeedsHouses()
  } else if (type == 'seeds') {
    return await getSeeds()
  } else if (type == 'clients') {
    return await getClients()
  } else if (type == 'users') {
    return await getUsers()
  } else if (type == 'stock') {
    return await getStock()
  }
}

export default {
  loadList
}
