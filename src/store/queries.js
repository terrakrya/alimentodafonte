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

var getCollectorsRequests = async function(state) {
  return await axios.get('rest/collectors-requests?_format=json').then(async response => {
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
      let seed = state.seeds.find(s => s.id == r.paragraph_seed)

      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.paragraph_weight)
      new_seed.remaining_weight = Number(r.paragraph_remaining_weight)
      if (index >= 0) {
        collectors_requests[index].seeds.push(new_seed)
      } else {
        r.seeds = [new_seed]
        collectors_requests.push(r)
      }
    })
    state.collectors_requests = collectors_requests.map(item => {
      return {
        id: item.nid,
        created: item.created,
        collector: item.requests_collector ?
          state.collectors.find(c => c.id == item.requests_collector) : null,
        collectors_group: item.requests_group ?
          state.collectors_groups.find(c => c.id == item.requests_group) : null,
        seeds_house: item.requests_seeds_house ?
          state.seeds_houses.find(c => c.id == item.requests_seeds_house) : null,
        seeds: item.seeds,
        weight: item.seeds.map((i) => i.weight).reduce((a, b) => a + b) || 0,
        remaining_weight: item.seeds.map((i) => i.remaining_weight).reduce((a, b) => a + b) || 0,
        price: item.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0,
      }
    })
    return state.collectors_requests
  })
}

var getOrders = async function(state) {
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
      let seed = state.seeds.find(s => s.id == r.order_entry_seed)

      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.order_entry_seeds_qtd)
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
        client: order.order_entry_clients.length ?
          state.clients.find(c => c.id == order.order_entry_clients[0]) : null,
        // total: Number(order.order_entry_total),
        total: order.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0,
        status: order.order_entry_contract,
        area: order.order_entry_restored_area,
        date_receiving: order.order_entry_date_receiving,
        deadline: order.order_entry_deadline,
        flood: order.order_entry_flood,
        bog: order.order_entry_bog,
        purchase_type: order.order_entry_purchase_type,
        amount_paid: order.order_entry_amount_paid || 0,
        amount_remain: order.order_entry_amount_remain || 0,
        close: (order.order_entry_close == 1),
        vegetation: order.order_entry_vegetation,
        seeds: order.seeds,
        weight: order.seeds.map((i) => i.weight).reduce((a, b) => a + b) || 0,
        price: order.seeds.map((i) => i.price * i.weight).reduce((a, b) => a + b) || 0
      }
    })
    return state.orders
  })
}

var getPotentialLists = async function(state) {
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
      let seed = state.seeds.find(s => s.id == r.potential_seed)

      var new_seed = Object.assign({}, seed)

      new_seed.weight = Number(r.potential_qtd)
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
        collector: potential_list.potential_collector ?
          state.collectors.find(c => c.id == potential_list.potential_collector) : null,
        group: potential_list.potential_group ?
          state.collectors_groups.find(c => c.id == potential_list.potential_group) : null,
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


var getLots = async function(state) {
  return await axios.get('rest/lots?_format=json').then(response => {
    state.lots = response.data.map(item => {
      return {
        id: item.tid[0].value,
        title: item.name[0].value,
        seed: item.species ? item.species[0].target_id : null,
        seeds_house: item.seeds_house ? item.seeds_house[0].target_id : null
      }
    })
    return state.lots
  })
}

var getCollections = async function(state) {
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
      if (item.seeds_collect_seed) {
        var seed = state.seeds.find(seed => seed.id == item.seeds_collect_seed[0].target_id)
      }
      if (item.seeds_collect_collector) {
        var collector = state.collectors.find(collector => collector.id == item.seeds_collect_collector[0].target_id)
      }
      if (item.seeds_collect_group) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.seeds_collect_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        date_time: item.seeds_collect_date_time ? item.seeds_collect_date_time[0].value : null,
        weight_gross: item.seeds_collect_weight_gross ? item.seeds_collect_weight_gross[0].value : 0,
        weight_benef: item.seeds_collect_weight_benef ? item.seeds_collect_weight_benef[0].value : 0,
        flowering: item.seeds_collect_flowering ? item.seeds_collect_flowering[0].value : null,
        commentary: item.seeds_collect_commentary ? item.seeds_collect_commentary[0].value : null,
        geolocation: item.seeds_collect_geolocation ? item.seeds_collect_geolocation[0] : {
          lat: null,
          lgn: null
        },
        photos: item.seeds_collect_photo.length ? item.seeds_collect_photo.map(p => p.url) : null,
        audio: item.seeds_collect_audio.length ? item.seeds_collect_audio[0].url : null,
        seed: seed,
        collector: collector,
        collectors_group: collectors_group,
      }
    })
    return state.collections
  })
}

var getSeedsMatrixes = async function(state) {
  return await axios.get('rest/seeds-matrixes?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    state.seeds_matrixes = response.data.map(item => {
      if (item.seed_matrix_collector) {
        var collector = state.collectors.find(collector => collector.id == item.seed_matrix_collector[0].target_id)
      }
      if (item.seed_matrix_group) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.seed_matrix_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        title: item.title[0].value,
        scient_name: item.seed_matrix_scient_name.length ? item.seed_matrix_scient_name[0].value : '',
        collec_months: item.seed_matrix_collec_months.length ? item.seed_matrix_collec_months[0].value : '',
        category: item.seed_matrix_category[0].value,
        source: item.seed_matrix_source[0].value,
        files: item.seed_matrix_files.map(file => (file.url)),
        geolocation: item.geolocation[0],
        collector: collector,
        collectors_group: collectors_group
      }
    })
    return state.seeds_matrixes
  })
}

var getCollectionAreas = async function(state) {
  return await axios.get('rest/collection-areas?_format=json').then(async response => {
    if (!state.collectors.length) {
      await getCollectors(state)
    }
    if (!state.collectors_groups.length) {
      await getCollectorsGroups(state)
    }
    state.collection_areas = response.data.map(item => {
      if (item.collection_collector) {
        var collector = state.collectors.find(collector => collector.id == item.collection_collector[0].target_id)
      }
      if (item.collection_group) {
        var collectors_group = state.collectors_groups.find(collectors_group => collectors_group.id == item.collection_group[0].target_id)
      }
      return {
        id: item.nid[0].value,
        title: item.title[0].value,
        description: item.description ? item.description[0].value : '',
        estimated_area: item.estimated_area.length ? item.estimated_area[0].value : '',
        city: item.state.length ? [item.state[0].locality, item.state[0].administrative_area].filter(Boolean).join(' - ') : '',
        geolocation: item.geolocation[0],
        file: item.upload ? item.upload[0].url : '',
        collector: collector,
        collectors_group: collectors_group
      }
    })
    return state.collection_areas
  })
}

var loadList = async function(type) {
  if (type == 'collectors_requests') {
    return await getCollectorsRequests()
  } else if (type == 'collectors') {
    return await getCollectors()
  } else if (type == 'collectors_groups') {
    return await getCollectorsGroups()
  } else if (type == 'seeds_houses') {
    return await getSeedsHouses()
  } else if (type == 'seeds') {
    return await getSeeds()
  } else if (type == 'orders') {
    return await getOrders()
  } else if (type == 'clients') {
    return await getClients()
  } else if (type == 'users') {
    return await getUsers()
  } else if (type == 'potential_lists') {
    return await getPotentialLists()
  } else if (type == 'collections') {
    return await getCollections()
  } else if (type == 'seeds_matrixes') {
    return await getSeedsMatrixes()
  } else if (type == 'collection_areas') {
    return await getCollectionAreas()
  } else if (type == 'stock') {
    return await getStock()
  } else if (type == 'lots') {
    return await getLots()
  }
}

export default {
  loadList
}
