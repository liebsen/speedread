let items = []
let index = 0
let pause = 0
let interval = 0
const progress = document.querySelector('.progress')
const speed = 15

let cycle = () => {
  progress.style.transitionDuration = speed + 's'
  if (pause) {
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
  setTimeout(() => {
    if (item) {
      document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
      document.querySelector('.speedread').innerHTML = `${item.description}`
      document.querySelector('.speedread').classList.add('fadeInRight')
    }
  }, 1000)
  index++
  const perc = parseFloat(index / items.length) * 100
  progress.style.width = perc + '%'
}

let search = () => {
  progress.style.transitionDuration = '0s'
  document.querySelector('.read-container').classList.remove('hidden')
  document.querySelector('.speedread').innerHTML = 'Fetching news...'
  document.querySelector('.speedread').classList.remove('fadeInRight', 'fadeOutLeft')
  document.querySelector('.speedread').classList.add('fadeIn')
  index = 0
  progress.style.width = '0%'
  if (interval) {
    clearInterval(interval)
  }
  $.get('fetch.php?type=' + document.getElementById('type').value + '&key=' + document.getElementById('key').value, function (data) {
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
      });
      if (!items.length) {
        document.querySelector('.speedread').innerHTML = 'No results for this search. Click search to try again.'
      } else {
        interval = setInterval(cycle, speed * 1000)
        cycle()
      }
    }
  })
  return false
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