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
  items = []
  index = 0
  progress.style.width = '0%'
  if (interval) {
    clearInterval(interval)
  }
  $.get('fetch.php?type=' + document.getElementById('type').value + '&key=' + document.getElementById('key').value, function (data) {
    $(data).find("item").each((i, e) => {
      items.push({
        title: $(e).find("title").text(),
        source: $(e).find("source").text(),
        link: $(e).find("link").text(),
        pubDate: $(e).find("pubDate").text(),
        description: $(e).find("description").text()
      })
    });
    interval = setInterval(cycle, speed * 1000)
    cycle()
  });

  return false
}