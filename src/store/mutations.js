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
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    if (!state.seeds_houses.length) {
      await getSeedsHouses(state)
    }
    if (!state.seeds.length) {
      await getSeeds(state)
    }
    let collectors_requests = []
    response.data.forEach(r => {
      let index = -1
      collectors_requests.forEach((req, i) => {
        if (req.nid == r.nid) {
          index = i
        }
      })
      let seed = state.seeds.find(s => s.id == r.field_paragraph_seed) 
       
      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.field_paragraph_weight)
      new_seed.remaining_weight = Number(r.field_paragraph_remaining_weight)
      if (index >= 0) {
        collectors_requests[index].seeds.push(new_seed)
      } else {
        r.seeds = [new_seed]
        collectors_requests.push(r)
      }
    })
    state.collectors_requests = collectors_requests.map(item =>  {
      return {  
        id: item.nid,
        created: item.created,
        collector: item.field_requests_collector
          ? state.collectors.find(c => c.id == item.field_requests_collector) 
          : null,
        collectors_group: item.field_requests_group
          ? state.collectors_groups.find(c => c.id == item.field_requests_group)
          : null,
        seeds_house: item.field_requests_seeds_house
          ? state.seeds_houses.find(c => c.id == item.field_requests_seeds_house)
          : null, 
        seeds: item.seeds,
        weight: item.seeds.map((i) => i.weight).reduce((a, b) => a + b) || 0,
        remaining_weight: item.seeds.map((i) => i.remaining_weight).reduce((a, b) => a + b) || 0,
        price: item.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0,
      }
    })
    return state.collectors_requests
  })
}

async function getOrders (state) {
  return await axios.get('rest/orders-entries?_format=json').then(async response => {
    if (!state.clients.length) {
      await getClients(state)
    }    
    if (!state.seeds.length) {
      await getSeeds(state)
    }

    let orders = []
    response.data.forEach(r => {
      let index = -1
      orders.forEach((req, i) => {
        if (req.nid == r.nid) {
          index = i
        }
      })
      let seed = state.seeds.find(s => s.id == r.field_order_entry_seed) 
       
      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.field_order_entry_seeds_qty)
      if (index >= 0) {
        orders[index].seeds.push(new_seed)
      } else {
        r.seeds = [new_seed]
        orders.push(r)
      }
    })
    state.orders = orders.map(order => {
      return { 
        id: order.nid,
        title: order.title,
        client: order.field_order_entry_clients.length 
          ? state.clients.find(c => c.id == order.field_order_entry_clients[0])
          : null,
        // total: Number(order.field_order_entry_total),
        total: order.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0,
        status: order.field_order_entry_contract,
        area: order.field_order_entry_restored_area,
        date_receiving: order.field_order_entry_date_receiving,
        deadline: order.field_order_entry_deadline,
        flood: order.field_order_entry_flood,
        bog: order.field_order_entry_bog,
        purchase_type: order.field_order_entry_purchase_type,
        amount_paid: order.field_order_entry_amount_paid || 0,
        amount_remain: order.field_order_entry_amount_remain || 0,
        close: (order.field_order_entry_close == 1),
        vegetation: order.field_order_entry_vegetation,
        seeds: order.seeds,
        weight: order.seeds.map((i) => i.weight).reduce((a, b) => a + b) || 0,
        price: order.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0
      }
    })
    return state.orders
  })
}

async function getPotentialLists (state) {
  return await axios.get('rest/potential-list?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }    
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }    
    if (!state.seeds.length) {
      await getSeeds(state)
    }

    let potential_lists = []
    response.data.forEach(r => {
      let index = -1
      potential_lists.forEach((req, i) => {
        if (req.nid == r.nid) {
          index = i
        }
      })
      let seed = state.seeds.find(s => s.id == r.field_potential_seed) 
       
      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.field_potential_qty)
      if (index >= 0) {
        potential_lists[index].seeds.push(new_seed)
      } else {
        r.seeds = [new_seed]
        potential_lists.push(r)
      }
    })
    state.potential_lists = potential_lists.map(potential_list => {
      return { 
        id: potential_list.nid,
        collector: potential_list.field_potential_collector 
          ? state.collectors.find(c => c.id == potential_list.field_potential_collector)
          : null,
        group: potential_list.field_potential_group
          ? state.collectors_groups.find(c => c.id == potential_list.field_potential_group)
          : null,
        date: potential_list.field_potential_date,
        weight: potential_list.seeds.map((i) => i.weight).reduce((a, b) => a + b) || 0,
        price: potential_list.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0,
        compensation_collect: potential_list.seeds.map((i) => i.compensation_collect * i.weight).reduce((a, b) => a + b) || 0,
        wholesale_price: potential_list.seeds.map((i) => i.wholesale_price * i.weight).reduce((a, b) => a + b) || 0,
        seeds: potential_list.seeds,
      }
    })
    return state.potential_lists
  })
}

async function getCollectors (state) {
  return await axios.get('rest/collectors?_format=json').then(response => {
    state.collectors = response.data.map(item => {
      return { 
        id: item.uid[0].value,
        title: item.field_name[0].value,
        description: item.field_nickname[0].value,
        picture: present(item.user_picture, 'url') ? item.user_picture[0].url : null,
      }
    })
    return state.collectors
  })
}

async function getClients (state) {
  return await axios.get('rest/clients?_format=json').then(response => {
    state.clients = response.data.map(item => {
      return { 
        id: item.uid[0].value,
        title: item.field_name[0].value,
        description: item.field_nickname[0].value,
        picture: present(item.user_picture, 'url') ? item.user_picture[0].url : null,
      }
    })
    return state.clients
  })
}

async function getCollectorsGroups (state) {
  return await axios.get('rest/collectors-groups?_format=json').then(response => {
    state.collectors_groups = response.data.map(item => {
      return { 
        id: item.nid[0].value,
        title: item.title[0].value,
        city: item.field_address.length ? 
        [item.field_address[0].locality, item.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
      }
    })
    return state.collectors_groups
  })
}
async function getSeedsHouses (state) {
  return await axios.get('rest/seeds-houses?_format=json').then(response => {
    state.seeds_houses = response.data.map(item => {
      return { 
        id: item.store_id[0].value,
        title: item.name[0].value,
        city: item.field_address.length ? 
        [item.field_address[0].locality, item.field_address[0].administrative_area].filter(Boolean).join(' - ') : ''
      }
    })
    return state.seeds_houses
  })
}
async function getSeeds (state) {
  return await axios.get('rest/seeds-list?_format=json').then(async response => {
    if (!state.product_variations.length) {
      await getProductVariations(state)
    }
    state.seeds = response.data.map(item => {
      var product_variation = state.product_variations.find(variation => variation.variation_id[0].value == item.variations[0].target_id)
      return { 
        id: item.product_id[0].value,
        title: item.title[0].value,
        description: item.field_scientific_name[0].value,
        picture: present(item.field_images, 'url') ? item.field_images[0].url : null,
        price: product_variation.price[0].number,
        wholesale_price: present(product_variation.field_wholesale_price, 'number') ? product_variation.field_wholesale_price[0].number : 0,
        compensation_collect: present(item.field_compensation_collect, 'number') ? item.field_compensation_collect[0].number : 0,
        stock: product_variation.field_stock[0].value,
      }
    })
    return state.product_variations
  })
}

async function getProductVariations (state) {
  return await axios.get('rest/product-variations?_format=json').then(resp => {
    state.product_variations = resp.data
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
    } else if (type == 'orders') {
      getOrders(state)
    } else if (type == 'clients') {
      getOrders(state)
    } else if (type == 'potential_lists') {
      getPotentialLists(state)
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