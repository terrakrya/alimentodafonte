export default {
  generateCode (names) {
    var initials = ''
    names.forEach(name => {
      var parts = name.split(' ')
      var qtdChars = 4 - parts.length
      if (qtdChars < 1) {
        qtdChars = 1
      }
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].length > 0 && parts[i] !== '') {
          initials += parts[i].substr(0,qtdChars)
        }
      }
      initials += '-'
    })
    if (initials == '') {
      initials = 'COD-'+Date.now()
    } else {
      initials += (new Date).getMilliseconds()
    }
    return initials.toUpperCase()
  }
}
