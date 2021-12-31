let items = []
let index = 0
let pause = 0
let interval = 0
const progress = document.querySelector('.progress')
const speed = 3
progress.style.transitionDuration = speed + 's'

let cycle = () => {
  if (pause) {
    return false
  }
  if (index < 0) {
    index = 0
  }
  if (index > items.length - 1) {
    index = 0
  }
  const item = items[index]
  document.querySelector('.speedread').classList.remove('flipInX', 'fadeOut')
  document.querySelector('.speedread').classList.add('fadeOut')
  setTimeout(() => {
    if (item) {
      document.querySelector('.speedread').textContent = item.title
      document.querySelector('.speedread').classList.add('flipInX')
    }
  }, 1000)
  index++
  const perc = parseFloat(index / items.length) * 100
  progress.style.width = perc + '%'
}

let search = () => {
  document.querySelector('.speedread').classList.add('fadeOut')
  document.querySelector('.read-container').classList.remove('hidden')
  items = []
  index = 0
  progress.style.width = '0%'
  if (interval) {
    clearInterval(interval)
  }
  $.get('fetch.php?type=' + document.getElementById('type').value + '&key=' + document.getElementById('key').value, function (data) {
    $(data).find("item").each(function () { // or "item" or whatever suits your feed
      items.push({
        title: $(this).find("title").text(),
        source: $(this).find("source").text(),
        pubDate: $(this).find("pubDate").text(),
        description: $(this).find("description").text()
      })
    });
    interval = setInterval(cycle, speed * 1000)
    cycle()
  });

  return false
}