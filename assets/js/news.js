let items = []
let index = 0
let pause = 0
let interval = 0
const progress = document.querySelector('.progress')
const speed = 15


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
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      }).catch(error => {
        console.log(error)
      // Auto-play was prevented
      // Show paused UI.
      })
    }
  }
}


let cycle = () => {
  progress.style.transitionDuration = speed + 's'
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
  document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
  document.querySelector('.speedread').classList.add('fadeOutLeft')
  document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  document.querySelector('.updated').classList.add('fadeOut')
  setTimeout(() => {
    if (item) {
      document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
      document.querySelector('.speedread').innerHTML = `${item.description}`
      document.querySelector('.speedread').classList.add('fadeInRight')
      document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
      document.querySelector('.updated').classList.add('fadeIn')
    }
  }, 1000)
  index++
  const perc = parseFloat(index / items.length) * 100
  progress.style.width = perc + '%'
}

let search = () => {
  const source = 'google'
  // const source = document.getElementById('source').value || 'google'
  const type = document.getElementById('type').value || 'language'
  const key = document.getElementById('key').value || ''
  document.querySelector('.read-container').classList.remove('hidden')
  document.querySelector('.speedread').innerHTML = 'Fetching news...'
  document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
  document.querySelector('.speedread').classList.add('fadeIn')
  document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  document.querySelector('.updated').classList.add('fadeOut')
  index = 0
  progress.style.transitionDuration = '0s'
  progress.style.width = '0%'
  if (interval) {
    clearInterval(interval)
  }
  $.get(`fetch.php?source=${source}&type=${type}&key=${key}`, function (data) {
    if (data === 'error') {
      document.querySelector('.speedread').innerHTML = 'Fetch failed. Click search to try again.'
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
        document.querySelector('.speedread').innerHTML = 'No results for this search. Click search to try again.'
      } else {
        playsound('updated.mp3')
        updateTime()
        interval = setInterval(cycle, speed * 1000)
        cycle()
      }
    }
  })
  return false
}

let updateInt = 0
let updateLast = 0
let updateTime = () => {
  updateLast = new Date()
  if (updateInt) {
    clearInterval(updateInt)
  }
  updateInt = setInterval(() => {
    document.querySelector('.updated').textContent = 'Updated ' + moment(updateLast).fromNow()
  }, 1000 * 60)
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.controls').classList.add('fadeInDown')
  document.querySelector('.read-container').addEventListener('click', e => {
    document.querySelector('.controls').classList.toggle('fadeInDown')
    document.querySelector('.controls').classList.toggle('fadeOutUp')
    let int = 1
    if(!document.querySelector('.controls').classList.contains('hidden')) {
      int = 500
    }
    setTimeout(() => {
      document.querySelector('.controls').classList.toggle('hidden')
    }, int)
  })
  search()
})

