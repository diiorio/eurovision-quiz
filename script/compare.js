/* eslint-env browser */
function compare (raw) { // eslint-disable-line no-unused-vars
  const data = {}
  for (var i = 0; i < raw.length; i += 1) {
    data[raw[i].countryCode] = raw[i]
  }
  const left = document.querySelector('#left button')
  left.previousElementSibling.value = getListFromUrl('left').join(' ')
  left.addEventListener('click', load)
  left.click()
  const right = document.querySelector('#right button')
  right.previousElementSibling.value = getListFromUrl('right').join(' ')
  right.addEventListener('click', load)
  right.click()

  function load (e) {
    const list = getList(e.target.previousElementSibling.value)
    const table = e.target.parentNode.querySelector('tbody')
    var html = ''
    var cc
    for (var i = 0; i < list.length; i += 1) {
      cc = list[i]
      html += '<tr>'
      html += '<td>' + (i + 1) + '.</td>'
      if (data.hasOwnProperty(cc)) {
        html += '<td><img title="' + data[cc].country + '" src="img/flags/' + cc + '.png"></td>'
        html += '<td class="song">' + data[cc].song + '</td>'
        html += '<td class="artist">' + data[cc].artist + '</td>'
      } else {
        html += '<td>' + cc + '</td>'
        html += '<td class="song">?</td>'
        html += '<td class="artist">?</td>'
      }
      html += '</tr>'
    }
    table.innerHTML = html
    updateUrl(e.target.parentNode.id, list.join(','))
  }

  function getList (str) {
    const list = str.match(/[A-Za-z]{2}|(?:\ud83c[\udde6-\uddff]){2}/g) || []
    for (var i = 0; i < list.length; i += 1) {
      list[i] = list[i].length === 2 ? list[i].toUpperCase() : emojiToStr(list[i])
    }
    return list
  }

  function emojiToStr (emoji) {
    function shift (str) {
      // Use charCode instead of codePoint for greater compatibility
      return String.fromCharCode(str.charCodeAt(0) - 56741)
    }
    return shift(emoji[1]) + shift(emoji[3])
  }

  function getListFromUrl (param) {
    const re = new RegExp(param + '=([^&]*)')
    const match = decodeURIComponent(window.location.search).match(re)
    return match ? getList(match[1]) : []
  }

  function updateUrl (param, value) {
    const obj = {}
    const frags = location.search.slice(1).split('&')
    var parts
    for (var i = 0; i < frags.length; i += 1) {
      parts = frags[i].split('=')
      obj[parts[0]] = parts[1]
    }
    obj[param] = value
    var keys = Object.keys(obj)
    for (i = 0; i < keys.length; i += 1) {
      keys[i] += '=' + obj[keys[i]]
    }
    window.history.pushState(null, '', '?' + keys.join('&'))
  }
}
