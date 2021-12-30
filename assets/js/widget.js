const e = (a, e, f) => {
  document.getElementById(a).addEventListener(e, ev => {
    f(ev)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.speedread').forEach(e => {
  	let contents = e.textContent.split(' ')
  	let pos = 0
    let clock = 0
  	let speed = e.getAttribute('speed') || 1
    let words = e.getAttribute('words') || 1
  	let fx = e.getAttribute('fx') || 'fadeIn'
    const progress = document.createElement('div')
    progress.classList.add('progress')
    e.parentNode.insertBefore(progress, e)

  	const cycle = () => {
  		if (clock) {
  			clearInterval(clock)
  		}
  		clock = setInterval(read, speed * 1000)
  	}

  	const read = () => {
  		const span = document.createElement('span')
      let p = 0
  		span.classList.add('animated', 'speed', fx)
  		e.innerHTML = ''
  		e.appendChild(span)

  		if (pos <= contents.length) {
        for (var w = 0; w < parseInt(words); w++) {
          p = pos + w + 1
          if (contents[p - 1]) {
            span.textContent+= contents[p - 1] + ' '
          }
        }
        pos = p
  		} else {
  			span.textContent = ''
  			pos = 0
  		}		
      progress.style.width = parseFloat(pos / contents.length) * 100 + '%'
  	}
    cycle()
  })
})