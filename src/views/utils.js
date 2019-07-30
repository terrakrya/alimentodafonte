export default {
  generateCode (names) {
    var initials = ''
    names.forEach(name => {
      var parts = name.split(' ')
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].length > 0 && parts[i] !== '') {
          if (i != 0) {
            initials += '-'
          }
          initials += parts[i].substr(0,3)
        }
      }
      initials += '-'
    })
    if (initials == '') {
      initials = 'COD-'+Date.now()
    } else {
      initials += (new Date).getFullYear()
    }
    return initials.toUpperCase()
  }
}
