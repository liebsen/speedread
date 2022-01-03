let items = []
let index = 0
let pause = 0
let interval = 0
const progressContainer = document.querySelector('.progress-container')
const speed = 15
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
let cycleInt = 0

let cycle = () => {
  if (cycleInt) {
    clearInterval(cycleInt)
  }
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
  if (index) {
    document.querySelector('.updated').classList.remove('fadeIn', 'fadeOut')
  }
  cycleInt = setTimeout(() => {
    if (item) {      
      document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
      document.querySelector('.speedread').innerHTML = `${item.description}`
      document.querySelector('.speedread').classList.add('fadeInRight')
      document.querySelector('.updated').classList.add('fadeIn')
      document.querySelectorAll('.progress').forEach(e => {
        e.classList.remove('active', 'actived')
      })
      for (var i=0;i<index;i++) {
        document.querySelector('.progress.item-' + i).classList.add('actived')
      }
      document.querySelector('.progress.item-' + index).classList.add('active')
      index++
    }
  }, 1000)  
}

let search = () => {
  const source = 'google'
  // const source = document.getElementById('source').value || 'google'
  const type = document.getElementById('type').value || 'language'
  const key = document.getElementById('key').value || ''
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
  $.get(`fetch.php?source=${source}&type=${type}&key=${key}`, function (data) {
    if (data === 'error') {
      if (items.length) {
        playsound('error.mp3')
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
  interval = setInterval(cycle, speed * 1000)
  cycle()
}

let progressItems = () => {
  for(var i =0; i <= items.length - 1; i++) {
    document.querySelector('.progress-container').innerHTML+=`<div class="progress-item" onclick="index=${i};cycle()"><div class="progress item-${i}"></div></div>`
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.controls').classList.add('fadeInDown')
  document.querySelector('.speedread').addEventListener('click', e => {
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
  setInterval(() => {
    document.querySelector('.updated').textContent = 'Updated ' + moment(updateLast).fromNow()
  }, 1000 * 15)
  search()
})

