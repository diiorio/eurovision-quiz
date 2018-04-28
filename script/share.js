;(function () {
  const select = document.getElementById('quick-share-select')
  const list = document.getElementsByClassName('quick-share-option')
  const options = {}
  for (var i = list.length - 1; i >= 0; i -= 1) {
    options[list[i].dataset.quickShare] = list[i]
  }
  var active = null
  select.addEventListener('change', update)
  update()
  function update (e) {
    if (active) {
      active.hidden = true
    }
    if (select.value) {
      options[select.value].hidden = false
      active = options[select.value]
    } else {
      active = null
    }
  }
})()
