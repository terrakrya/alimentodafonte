module.exports = {
  populate(req) {
    var populate = req.query.populate
    if (populate) {
      if (populate && populate.search('{') != -1) {
        populate = JSON.parse(req.query.populate)
      }
    } else {
      populate = ''
    }
    return populate
  },
  select(req) {
    var select = req.query.select
    if (select) {
      if (select && select.search('{') != -1) {
        select = JSON.parse(req.query.select)
      }
    } else {
      select = ''
    }
    return select
  },
  sumQtd(seed_item, request_collector, collector) {
    if (typeof seed_item.qtd == 'object') {
      if (collector) {
        return seed_item.qtd.map(q => {
          return parseFloat(((q.collector == collector) ? q.qtd : 0))
        }).reduce((a, b) => a + b)

      } else {
        return seed_item.qtd.map(q => parseFloat(q.qtd || 0)).reduce((a, b) => a + b)
      }
    } else {
      if (request_collector && request_collector == collector) {
        return seed_item.qtd || 0
      } else {
        return 0
      }
    }
  },
  fixQtdToNumber(obj) {
    obj.seed_items = collectors_request.seed_items.map(seed_item => {
      if (typeof seed_item.qtd == 'string') {
        seed_item.qtd = parseFloat(seed_item.qtd)
      }
      return seed_item
    })
  }
}
