const e = (a, e, f) => {
  document.getElementById(a).addEventListener(e, ev => {
    f(ev)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.speedread').forEach(e => {
  	let contents = e.textContent.trim().split(' ').filter(item => item && item.replace(/\n|\r/g, ""))
  	let pos = 0
    let clock = 0
  	let speed = e.getAttribute('speed') || 1
    let length = parseInt(e.getAttribute('length')) || 1
    const ratio = Math.ceil(contents.length / length) + 1
    const delta = contents.length % length

  	let fx = e.getAttribute('fx') || 'fadeIn'
    const progress = document.createElement('div')
    progress.classList.add('progress')
    e.parentNode.insertBefore(progress, e)

    setTimeout(() => {
      e.classList.add('animated', 'fadeIn')
    }, 1000)
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
        span.textContent = contents.slice(pos, length + pos).join(' ')
        pos+= length
        const perc = parseFloat(pos / (contents.length + length - delta)) * 100
        progress.style.width = perc + '%'
  		} else {
  			span.textContent = ''
        progress.style.width = '0%'
  			pos = 0
  		}      
  	}
    cycle()
  })
})
