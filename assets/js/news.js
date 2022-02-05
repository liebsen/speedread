let items = []
let index = 0
let lastIndex = 0
let pause = 0
let interval = 0
const progressContainer = document.querySelector('.progress-container')
const speed = 15
let preferences = localStorage.getItem('preferences') ? JSON.parse(localStorage.getItem('preferences')) : { mode: 'topstories', keyword: '' }
let updateLast = new Date()

let playsound = (sound, vol) => {

  if (sound === undefined) {
    sound = 'move.mp3'
  }

  if (vol === undefined) {
    vol = 0.5
  }

  const soundObj = new Audio(['/assets/sounds',sound].join('/'))
  soundObj.volume = vol

  if (sound) {
    var playPromise = soundObj.play()
    if (playPromise !== undefined) {
      playPromise.then(_ => {}).catch(error => {
        console.log(error)
      })
    }
  }
}

let setmode = mode => {
  document.querySelectorAll('.select-mode').forEach(e => {
    e.classList.remove('selected')
  })
  document.querySelector(`[data-id="${mode}"]`).classList.add('selected')
  preferences.mode = mode
  localStorage.setItem('preferences', JSON.stringify(preferences))
}

let cycleInt = 0
let cycle = () => {
  if (index && pause) {
    return false
  }
  if (index < 0) {
    index = 0
  }
  if (index > items.length - 1) {
    return search()
  }

  const item = items[index]
  const lr_from = lastIndex < index ? 'Left' : 'Right'
  const lr_to = lastIndex < index ? 'Right' : 'Left'
  document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft', 'fadeInLeft', 'fadeOutRight')
  document.querySelector('.speedread').classList.add(`fadeOut${lr_from}`)
  document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  document.querySelector('.updated').classList.add('fadeOut')
  if (index) {
    document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  }
  if (cycleInt) {
    clearInterval(cycleInt)
  }  
  cycleInt = setTimeout(() => {
    if (item) {
      const fromnow = moment(item.pubDate).fromNow()
      document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft', 'fadeInLeft', 'fadeOutRight')
      document.querySelector('.speedread').innerHTML = `${item.description} <div class="speedread-date">${fromnow}</div>`
      document.querySelector('.speedread').classList.add(`fadeIn${lr_to}`)
      document.querySelector('.updated').classList.add('fadeIn')
      document.querySelectorAll('.progress').forEach(e => {
        e.classList.remove('active', 'reset')
      })
      for (var i=0;i<index;i++) {
        document.querySelector('.progress.item-' + i).classList.add('reset')
      }
      setTimeout(() => {
        // document.querySelector('.progress.item-' + index).classList.remove('reset')
        if (document.querySelector('.progress.item-' + index)) {
          document.querySelector('.progress.item-' + index).classList.add('active')
        }
      }, 1)
      setTimeout(() => {
        lastIndex = index
        index++
        if (interval) {
          clearInterval(interval)
        }
        interval = setTimeout(cycle, speed * 1000)   
      }, 10)
    }
  }, 250)  
}

let search = () => {
  const source = 'google'
  // const source = document.getElementById('source').value || 'google'
  const keyword = document.getElementById('keyword').value || preferences.keyword
  document.querySelector('.progress-container').classList.remove('fadeOut', 'fadeIn', 'show')
  document.querySelector('.progress-container').innerHTML = ''
  document.querySelector('.read-container').classList.remove('hidden')
  document.querySelector('.speedread').innerHTML = 'Fetching news...'
  document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
  document.querySelector('.speedread').classList.add('fadeIn')
  document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  document.querySelector('.updated').classList.add('fadeOut')
  index = 0
  if (interval) {
    clearInterval(interval)
  }
  $.get(`fetch.php?source=${source}&mode=${preferences.mode}&keyword=${keyword}`, function (data) {
    if (data === 'error') {
      playsound('error.mp3')
      if (items.length) {
        startCycle()
      } else {
        document.querySelector('.speedread').innerHTML = `Fetch failed. <a href="javascript:document.querySelector('.searchform').submit()">Try again</a>.`
      }
    } else {
      items = []
      $(data).find("item").each((i, e) => {
        items.push({
          title: $(e).find("title").text(),
          source: $(e).find("source").text(),
          link: $(e).find("link").text(),
          pubDate: $(e).find("pubDate").text(),
          description: $(e).find("description").text()
        })
      })
      if (!items.length) {
        document.querySelector('.speedread').innerHTML = 'No results for this search. Try again with another keyword.'
      } else {
        document.querySelector('.progress-container').classList.add('fadeIn', 'show')
        playsound('updated.mp3')
        updateLast = new Date()
        startCycle()
      }
    }
  })
  return false
}

let prevRead = () => {
  let p = pause
  pause = 0
  index-=2
  cycle()
  pause = p
}

let nextRead = () => {
  let p = pause
  pause = 0
  cycle()
  pause = p
}

let startCycle = () => {
  progressItems()
  cycle()
}

let toggleCntrs = () => {
  document.querySelector('.controls').classList.toggle('scaleIn')
  document.querySelector('.controls').classList.toggle('scaleOut')  
}
let progressItems = () => {
  for(var i =0; i <= items.length - 1; i++) {
    document.querySelector('.progress-container').innerHTML+=`<div class="progress-item" onclick="index=${i};cycle()"><div class="progress item-${i}"></div></div>`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // document.querySelector('.controls').classList.add('fadeInDown')
  document.querySelector('.controls form').addEventListener('submit', e => {
    toggleCntrs()
  })
  document.querySelector('.controls-toggle').addEventListener('click', e => {
    toggleCntrs()
  })

  document.querySelectorAll('.select-mode').forEach(e => {
    e.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id')
      setmode(id)
      if (id === 'topstories') {
        toggleCntrs()  
        search()
      } else {
        document.getElementById('keyword').focus()
      }
    })
  })

  document.querySelector('.speedread').addEventListener('click', e => {
    //document.querySelector('.controls').classList.toggle('fadeInDown')
    //document.querySelector('.controls').classList.toggle('fadeOutUp')
    let int = 1
    if(!document.querySelector('.controls').classList.contains('hidden')) {
      int = 500
    }
    setTimeout(() => {
      document.querySelector('.controls').classList.toggle('hidden')
    }, int)
  })
  setInterval(() => {
    document.querySelector('.updated').textContent = 'Updated ' + moment(updateLast).fromNow()
  }, 1000 * 15)
  document.querySelector(`[data-id="${preferences.mode}"]`).classList.add('selected')
  if (preferences.keyword.length) {
    document.getElementById('keyword').value = preferences.keyword
  }
  search()
})

