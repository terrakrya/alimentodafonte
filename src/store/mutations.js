import axios from 'axios'
export const STORAGE_KEY = 'todos-vuejs'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

function present (field, item = 'value') {
  return (field && field.length > 0 && field[0][item])
}

async function getCollectorsRequests (state) {
  return axios.get('rest/collectors-requests?_format=json').then(async response => {
    if (!state['collectors'].length) {
      await getCollectors(state)
    }
    if (!state['collectors_groups'].length) {
      await getCollectorsGroups(state)
    }
    if (!state['seeds_houses'].length) {
      await getSeedsHouses(state)
    }
    if (!state['seeds'].length) {
      await getSeeds(state)
    }
    var collectors_requests = []
    response.data.forEach(r => {
      var index = -1
      collectors_requests.forEach((req, i) => {
        if (req.nid == r.nid) {
          index = i
        }
      })
      var seed = state['seeds'].find(s => s.id == r.field_paragraph_seed) 
      
      seed.weight = r.field_paragraph_weight
      seed.remaining_weight = r.field_paragraph_remaining_weight
      if (index >= 0) {
        collectors_requests[index].seeds.push(seed)
      } else {
        r.seeds = [seed]
        collectors_requests.push(r)
      }
    })
    state['collectors_requests'] = collectors_requests.map(item =>  {
      return {  
        id: item.nid,
        created: item.created,
        collector: item.field_requests_collector
          ? state['collectors'].find(c => c.id == item.field_requests_collector) 
          : null,
        collectors_group: item.field_requests_group
          ? state['collectors_groups'].find(c => c.id == item.field_requests_group)
          : null,
        seeds_house: item.field_requests_seeds_house
          ? state['seeds_houses'].find(c => c.id == item.field_requests_seeds_house)
          : null, 
        seeds: item.seeds,
        weight: item.seeds.map((item) => Number(item.weight)).reduce((a, b) => a + b),
        remaining_weight: item.seeds.map((item) => Number(item.remaining_weight)).reduce((a, b) => a + b),
        price: item.seeds.map((item) => Number(item.price) * Number(item.weight)).reduce((a, b) => a + b),
      }
    })
    return state['collectors_requests']
  })
}

async function getCollectors (state) {
  return await axios.get('rest/collectors?_format=json').then(response => {
    state['collectors'] = response.data.map(item => {
      return { 
        id: item.uid[0].value,
        title: item.field_name[0].value,
        description: item.field_nickname[0].value,
        picture: present(item.user_picture, 'url') ? item.user_picture[0].url : null,
      }
    })
    return state['collectors']
  })
}
async function getCollectorsGroups (state) {
  return await axios.get('rest/collectors-groups?_format=json').then(response => {
    state['collectors_groups'] = response.data.map(item => {
      return { 
        id: item.nid[0].value,
        title: item.title[0].value,
        city: item.field_address.length ? 
        [item.field_address[0].locality, item.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
      }
    })
    return state['collectors_groups']
  })
}
async function getSeedsHouses (state) {
  return await axios.get('rest/seeds-houses?_format=json').then(response => {
    state['seeds_houses'] = response.data.map(item => {
      return { 
        id: item.store_id[0].value,
        title: item.name[0].value,
        city: item.field_address.length ? 
        [item.field_address[0].locality, item.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
      }
    })
    return state['seeds_houses']
  })
}
async function getSeeds (state) {
  return await axios.get('rest/seeds-list?_format=json').then(async response => {
    if (!state['product_variations'].length) {
      await getProductVariations(state)
    }
    state['seeds'] = response.data.map(item => {
      var product_variation = state['product_variations'].find(variation => variation.variation_id[0].value = item.variations[0].target_id)
      return { 
        id: item.product_id[0].value,
        title: item.title[0].value,
        description: item.field_scientific_name[0].value,
        picture: present(item.field_images, 'url') ? item.field_images[0].url : null,
        price: product_variation.price[0].number,
        wholesale_price: product_variation.field_wholesale_price[0].number,
        stock: product_variation.field_stock[0].value,
      }
    })
    return state['product_variations']
  })
}

async function getProductVariations (state) {
  return await axios.get('rest/product-variations?_format=json').then(resp => {
    state['product_variations'] = resp.data
  })
}

export const mutations = {
  login (state, currentUser) {
    state.currentUser = currentUser
  },

  logout (state) {
    state.currentUser = undefined
  },

  toggleMenu (state) {
    state.showMenu = !state.showMenu
  },

  addTodo (state, todo) {
    state.todos.push(todo)
  },

  async loadList (state, type) {
    if (type == 'collectors_requests') {
      getCollectorsRequests(state)
    } else if (type == 'collectors') {
      getCollectors(state)
    } else if (type == 'collectors_groups') {
      getCollectorsGroups(state)
    } else if (type == 'seeds_houses') {
      getSeedsHouses(state)
    } else if (type == 'seeds') {
      getSeeds(state)
    }
    
  },

  removeTodo (state, todo) {
    state.todos.splice(state.todos.indexOf(todo), 1)
  },

  editTodo (state, { todo, text = todo.text, done = todo.done }) {
    todo.text = text
    todo.done = done
  },

  
}