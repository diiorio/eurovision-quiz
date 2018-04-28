/* eslint-env browser */
function initialize (year, raw) { // eslint-disable-line no-unused-vars
  const STORAGEKEY = 'incomplete-esc' + year
  // Page elements
  const startBtns = document.getElementById('start-buttons')
  const beginBtn = document.getElementById('begin')
  const loadBtn = document.getElementById('load')
  const form = document.getElementById('result-form')
  const formResult = document.getElementById('result')
  const comparisonSection = document.getElementById('comparisons')
  const roundCounter = document.getElementById('round-counter')
  const percentCounter = document.getElementById('percent-counter')
  const leftBtn = document.getElementById('left')
  const leftFlag = leftBtn.querySelector('.flag')
  const leftCountry = leftBtn.querySelector('.country')
  const leftSong = leftBtn.querySelector('.song')
  const leftArtist = leftBtn.querySelector('.artist')
  const leftLinksToggle = leftBtn.nextElementSibling.firstElementChild
  const leftLinksList = leftLinksToggle.nextElementSibling
  const rightBtn = document.getElementById('right')
  const rightFlag = rightBtn.querySelector('.flag')
  const rightCountry = rightBtn.querySelector('.country')
  const rightSong = rightBtn.querySelector('.song')
  const rightArtist = rightBtn.querySelector('.artist')
  const rightLinksToggle = rightBtn.nextElementSibling.firstElementChild
  const rightLinksList = rightLinksToggle.nextElementSibling
  const saveBtn = document.getElementById('save-progress')
  const savedMsg = document.getElementById('saved-message')
  addInitialListeners()
  // Function definitions
  function addInitialListeners () {
    beginBtn.addEventListener('click', startNew, false)
    leftLinksToggle.addEventListener('click', function (e) {
      leftLinksList.hidden ^= 1
    }, false)
    rightLinksToggle.addEventListener('click', function (e) {
      rightLinksList.hidden ^= 1
    }, false)
    // Detect whether localStorage exists/has been used and enable features as appropriate
    if (!localStorageExists()) {
      return false
    }
    saveBtn.hidden = false
    const saved = localStorage.getItem(STORAGEKEY)
    if (!saved) {
      return false
    }
    loadBtn.addEventListener('click', startFromLoad, false)
    loadBtn.hidden = false
    // Show warning if new entries have been added since last save
    const data = JSON.parse(saved).entries
    if (data.length !== raw.length) {
      loadBtn.firstElementChild.hidden = false
    }
    return true
  }
  function startNew () {
    const entries = raw.slice(0)
    // Randomize starting entry order
    for (var temp, n, i = entries.length - 1; i >= 0; i -= 1) {
      n = Math.random() * (i + 1) | 0
      temp = entries[i]
      entries[i] = entries[n]
      entries[n] = temp
    }
    const records = new Array(entries.length).fill(0)
    const indices = [records.map(function (_, i) {
      return i
    })]
    const parents = [-1]
    var totalComparisons = 0
    var mid
    // Split indices into tree for insertion sort
    for (n = 1, i = 0; i < indices.length; i += 1) {
      if (indices[i].length >= 2) {
        mid = Math.ceil(indices[i].length / 2)
        indices[n] = indices[i].slice(0, mid)
        parents[n] = i
        totalComparisons += indices[n].length
        n += 1
        indices[n] = indices[i].slice(mid)
        parents[n] = i
        totalComparisons += indices[n].length
        n += 1
      }
    }
    return start({
      entries: entries,
      records: records,
      indices: indices,
      parents: parents,
      totalComparisons: totalComparisons,
      recIdx: 0,
      leftIdx: indices.length - 2,
      rightIdx: indices.length - 1,
      leftHead: 0,
      rightHead: 0,
      roundNum: 1,
      numCompared: 0
    })
  }
  function localStorageExists () {
    const test = 'Does localStorage exist?'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  }
  function startFromLoad () {
    const data = JSON.parse(localStorage.getItem(STORAGEKEY))
    // Only country codes are stored; need to convert back to full data objects
    const obj = {}
    const saved = data.entries
    raw.forEach(function (entry) {
      obj[entry.countryCode] = entry
    })
    const entries = saved.map(function (countryCode) {
      return obj[countryCode]
    })
    data.entries = entries
    return start(data)
  }
  function start (data) {
    // Add event listeners that require variables in this scope
    leftBtn.addEventListener('click', boxClicked.bind(null, -1), false)
    rightBtn.addEventListener('click', boxClicked.bind(null, 1), false)
    saveBtn.addEventListener('click', save, false)
    // Initialize sorting variables
    const entries = data.entries
    const records = data.records
    const indices = data.indices
    const parents = data.parents
    const totalComparisons = data.totalComparisons
    var recIdx = data.recIdx
    var leftIdx = data.leftIdx
    var rightIdx = data.rightIdx
    var leftHead = data.leftHead
    var rightHead = data.rightHead
    var roundNum = data.roundNum
    var numCompared = data.numCompared
    // Update page with sort options
    next(getState())
    startBtns.hidden = true
    comparisonSection.hidden = false
    // Function definitions
    function boxClicked (dir, e) {
      const sorted = sort(dir)
      if (sorted.finished) {
        return finish(sorted.result)
      } else {
        if (!savedMsg.hidden) {
          savedMsg.hidden = true
        }
        return next(sorted)
      }
    }
    function save (e) {
      // Only store the country codes to save space and in case the data for a country changes
      // Storing all variables is probably redundant, but I can't be bothered to figure out how to
      // deconstruct/reconstruct them
      const stored = {
        entries: entries.map(function (entry) {
          return entry.countryCode
        }),
        records: records,
        indices: indices,
        parents: parents,
        totalComparisons: totalComparisons,
        recIdx: recIdx,
        leftIdx: leftIdx,
        rightIdx: rightIdx,
        leftHead: leftHead,
        rightHead: rightHead,
        roundNum: roundNum,
        numCompared: numCompared
      }
      localStorage.setItem(STORAGEKEY, JSON.stringify(stored))
      savedMsg.hidden = false
    }
    function sort (dir) {
      // Mark the current choice
      if (dir < 0) {
        records[recIdx] = indices[leftIdx][leftHead]
        leftHead += 1
      } else {
        records[recIdx] = indices[rightIdx][rightHead]
        rightHead += 1
      }
      recIdx += 1
      numCompared += 1
      // Propagate changes
      if (leftHead < indices[leftIdx].length && rightHead === indices[rightIdx].length) {
        while (leftHead < indices[leftIdx].length) {
          records[recIdx] = indices[leftIdx][leftHead]
          leftHead += 1
          recIdx += 1
          numCompared += 1
        }
      } else if (leftHead === indices[leftIdx].length && rightHead < indices[rightIdx].length) {
        while (rightHead < indices[rightIdx].length) {
          records[recIdx] = indices[rightIdx][rightHead]
          rightHead += 1
          recIdx += 1
          numCompared += 1
        }
      }
      if (leftHead === indices[leftIdx].length && rightHead === indices[rightIdx].length) {
        for (var i = 0; i < indices[leftIdx].length + indices[rightIdx].length; i += 1) {
          indices[parents[leftIdx]][i] = records[i]
        }
        indices.splice(indices.length - 2, 2)
        leftIdx -= 2
        rightIdx -= 2
        leftHead = 0
        rightHead = 0
        if (leftHead === 0 && rightHead === 0) {
          records.fill(0)
          recIdx = 0
        }
      }
      // Return current state
      if (leftIdx < 0) {
        return {
          finished: true,
          result: indices[0].map(function (idx) {
            return entries[idx].countryCode
          })
        }
      } else {
        roundNum += 1
        return getState()
      }
    }
    function getState () {
      return {
        finished: false,
        left: entries[indices[leftIdx][leftHead]],
        right: entries[indices[rightIdx][rightHead]],
        round: roundNum,
        percent: Math.floor(100 * numCompared / totalComparisons)
      }
    }
  }
  // Function definitions (outside sorting scope)
  function next (data) {
    // Update page display
    roundCounter.textContent = data.round
    percentCounter.textContent = data.percent
    leftFlag.src = 'img/flags/' + data.left.countryCode + '.png'
    leftCountry.textContent = data.left.country
    leftSong.textContent = data.left.song
    leftArtist.textContent = data.left.artist
    rightFlag.src = 'img/flags/' + data.right.countryCode + '.png'
    rightCountry.textContent = data.right.country
    rightSong.textContent = data.right.song
    rightArtist.textContent = data.right.artist
    updateLinks(leftLinksList, data.left.links)
    updateLinks(rightLinksList, data.right.links)
  }
  function finish (result) {
    // If we had a partial result saved, we no longer need it
    if (localStorageExists() && localStorage.length) {
      localStorage.removeItem(STORAGEKEY)
    }
    // Submit result
    formResult.value = result.join(',')
    form.submit()
  }
  function updateLinks (ul, arr) {
    function modify (a, data) {
      a.textContent = data.text
      a.href = data.url
    }
    var i, a, li
    ul.hidden = true
    const children = ul.children
    if (arr.length < children.length) {
      // Modify existing list items
      for (i = 0; i < arr.length; i += 1) {
        modify(children[i].firstElementChild, arr[i])
      }
      // Delete extra list items
      for (i = children.length - 1; i >= arr.length; i -= 1) {
        ul.removeChild(children[i])
      }
    } else {
      // Modify existing list items
      for (i = 0; i < children.length; i += 1) {
        modify(children[i].firstElementChild, arr[i])
      }
      // Add new list items
      for (; i < arr.length; i += 1) {
        li = ul.appendChild(document.createElement('li'))
        a = li.appendChild(document.createElement('a'))
        a.target = '_blank'
        modify(a, arr[i])
      }
    }
  }
}
