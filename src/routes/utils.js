module.exports = {
  populate (req) {
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
  select (req) {
    var select = req.query.select
    if (select) {
      if (select && select.search('{') != -1) {
        select = JSON.parse(req.query.select)
      }
    } else {
      select = ''
    }
    return select
  }
}
