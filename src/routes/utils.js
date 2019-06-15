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
  }
}
