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

async function getStock (state) {
  return await axios.get('rest/stock?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    if (!state.seeds.length) {
      await getSeeds(state)
    }
    if (!state.seeds_houses.length) {
      await getSeedsHouses(state)
    }
    if (!state.clients.length) {
      await getClients(state)
    }
    if (!state.lots.length) {
      await getLots(state)
    }

    state.stock = response.data.map(stock_movement => {

      let type = stock_movement.type[0].target_id == 'stock_in' ? '' : '_out'

      let movement = {
        nid: stock_movement.nid[0].value,
        created: stock_movement.created[0].value,
        type: stock_movement.type[0].target_id,
      }

      if (present(stock_movement['field_seeds_house'+type], 'target_id')) {
        movement.seeds_house = state.seeds_houses.find(item => {
          return item.id == stock_movement['field_seeds_house'+type][0].target_id
        })
      }

      if (present(stock_movement.field_group, 'target_id')) {
        movement.group_collector_client = state.collectors_groups.find(item => {
          return item.id == stock_movement.field_group[0].target_id
        })
        if (movement.group_collector_client)
          movement.group_collector_client.type = 'collectors_group'
      } else if (present(stock_movement.field_collector, 'target_id')) {
        movement.group_collector_client = state.collectors.find(item => {
          return item.id == stock_movement.field_collector[0].target_id
        })
        if (movement.group_collector_client)
          movement.group_collector_client.type = 'collector'
      } else if (present(stock_movement.field_buyer, 'target_id')) {
        movement.group_collector_client = state.clients.find(item => {
          return item.id == stock_movement.field_buyer[0].target_id
        })
        if (movement.group_collector_client)
          movement.group_collector_client.type = 'buyer'
      }

      if (present(stock_movement['field_seed'+type], 'target_id')) {
        movement.seed = state.seeds.find(item => {
          return item.id == stock_movement['field_seed'+type][0].target_id
        })
      }

      if (present(stock_movement['field_lot'+type], 'target_id')) {
        movement.lot = state.lots.find(item => {
          return item.id == stock_movement['field_lot'+type][0].target_id
        })
      }

      if (present(stock_movement['field_qty'+type])) {
        if (type == '_out' && Number(stock_movement['field_qty'+type][0].value) > 0) {
          movement.qty = Number(stock_movement['field_qty'+type][0].value) * - 1
        } else {
          movement.qty = Number(stock_movement['field_qty'+type][0].value)
        }

      }

      if (present(stock_movement['field_price'+type])) {
        movement.price = Number(stock_movement['field_price'+type][0].value)
      }

      if (present(stock_movement.field_out_mode)) {
        movement.out_mode = stock_movement.field_out_mode[0].value
      }

      return movement
    })

    return state.stock
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
        city: item.address.length ?
        [item.address[0].locality, item.address[0].administrative_area].filter(Boolean).join(' - ') : ''
      }
    })
    return state.seeds_houses
  })
}
async function getSeeds (state) {
  return await axios.get('seeds').then(async response => {
    state.seeds = response.data
    return state.seeds
  })
}

async function getLots (state) {
  return await axios.get('rest/lots?_format=json').then(response => {
    state.lots = response.data.map(item => {
      return {
        id: item.tid[0].value,
        title: item.name[0].value,
        seed: present(item.field_species, 'target_id') ? item.field_species[0].target_id : null,
        seeds_house: present(item.field_seeds_house, 'target_id') ? item.field_seeds_house[0].target_id : null
      }
    })
    return state.lots
  })
}

async function getCollections (state) {
  return await axios.get('rest/collections?_format=json').then(async response => {
    if (!state.seeds.length) {
      await getSeeds(state)
    }
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    state.collections = response.data.map(item => {
      if (present(item.field_seeds_collect_seed, 'target_id')) {
        var seed = state.seeds.find(seed => seed.id == item.field_seeds_collect_seed[0].target_id)
      }
      if (present(item.field_seeds_collect_collector, 'target_id')) {
        var collector = state.collectors.find(collector => collector.id == item.field_seeds_collect_collector[0].target_id)
      }
      if (present(item.field_seeds_collect_group, 'target_id')) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.field_seeds_collect_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        date_time: present(item.field_seeds_collect_date_time) ? item.field_seeds_collect_date_time[0].value : null,
        weight_gross: present(item.field_seeds_collect_weight_gross) ? item.field_seeds_collect_weight_gross[0].value : 0,
        weight_benef: present(item.field_seeds_collect_weight_benef) ? item.field_seeds_collect_weight_benef[0].value : 0,
        flowering: present(item.field_seeds_collect_flowering) ? item.field_seeds_collect_flowering[0].value : null,
        commentary: present(item.field_seeds_collect_commentary) ? item.field_seeds_collect_commentary[0].value : null,
        geolocation: present(item.field_seeds_collect_geolocation, 'lat') ? item.field_seeds_collect_geolocation[0] : {lat: null, lgn: null},
        photos: item.field_seeds_collect_photo.length ? item.field_seeds_collect_photo.map(p => p.url) : null,
        audio: item.field_seeds_collect_audio.length ? item.field_seeds_collect_audio[0].url : null,
        seed: seed,
        collector: collector,
        collectors_group: collectors_group,
      }
    })
    return state.collections
  })
}

async function getSeedsMatrixes (state) {
  return await axios.get('rest/seeds-matrixes?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    state.seeds_matrixes = response.data.map(item => {
      if (present(item.field_seed_matrix_collector, 'target_id')) {
        var collector = state.collectors.find(collector => collector.id == item.field_seed_matrix_collector[0].target_id)
      }
      if (present(item.field_seed_matrix_group, 'target_id')) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.field_seed_matrix_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        title: item.title[0].value,
        scient_name: item.field_seed_matrix_scient_name.length ? item.field_seed_matrix_scient_name[0].value : '',
        collec_months: item.field_seed_matrix_collec_months.length ? item.field_seed_matrix_collec_months[0].value : '',
        category: item.field_seed_matrix_category[0].value,
        source: item.field_seed_matrix_source[0].value,
        files: item.field_seed_matrix_files.map(file => (file.url)),
        geolocation: item.field_geolocation[0],
        collector: collector,
        collectors_group: collectors_group
      }
    })
    return state.seeds_matrixes
  })
}

async function getCollectionAreas (state) {
  return await axios.get('rest/collection-areas?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    state.collection_areas = response.data.map(item => {
      if (present(item.field_collection_collector, 'target_id')) {
        var collector = state.collectors.find(collector => collector.id == item.field_collection_collector[0].target_id)
      }
      if (present(item.field_collection_group, 'target_id')) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.field_collection_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        title: item.title[0].value,
        description: present(item.field_description) ? item.field_description[0].value : '',
        estimated_area: item.field_estimated_area.length ? item.field_estimated_area[0].value : '',
        city: item.field_state.length ?
          [item.field_state[0].locality, item.field_state[0].administrative_area].filter(Boolean).join(' - ')
          : '',
        geolocation: item.field_geolocation[0],
        file: present(item.field_upload, 'url') ? item.field_upload[0].url : '',
        collector: collector,
        collectors_group: collectors_group
      }
    })
    return state.collection_areas
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
      getClients(state)
    } else if (type == 'potential_lists') {
      getPotentialLists(state)
    } else if (type == 'collections') {
      getCollections(state)
    } else if (type == 'seeds_matrixes') {
      getSeedsMatrixes(state)
    } else if (type == 'collection_areas') {
      getCollectionAreas(state)
    } else if (type == 'stock') {
      getStock(state)
    } else if (type == 'lots') {
      getLots(state)
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
