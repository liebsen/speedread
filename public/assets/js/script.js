const e = (a, e, f) => {
  document.getElementById(a).addEventListener(e, ev => {
    f(ev)
  })
}

document.addEventListener('DOMContentLoaded', () => {
	let contents = []
	let pos = 0
  let clock = 0
	let speed = document.getElementById('speed').value // secs
  let mode = document.getElementById('mode').value
  let words = document.getElementById('words').value
	let fx = document.getElementById('fx').value

  e('mode','change', e => {
    e.preventDefault()
    mode = e.target.value
    cycle()
  })

	e('speed', 'change', e => {
		e.preventDefault()
		speed = e.target.value
		cycle()
	})

  e('words', 'change', e => {
    e.preventDefault()
    words = e.target.value
    cycle()
  })

	e('fx', 'change', e => {
		e.preventDefault()
		fx = e.target.value
	})

	e('pasteform', 'submit', e => {
		e.preventDefault()
		let text = document.getElementById('paste').value
		contents = text.split(' ')
		cycle()
		return false
	})

	const cycle = () => {
		if (clock) {
			clearInterval(clock)
		}
		clock = setInterval(read, speed * 1000)
	}

	const read = () => {
		const word = document.getElementById('word')
		const span = document.createElement('h1')
    let p = 0
		span.classList.add('animated', 'speed', fx)
		word.innerHTML = ''
		word.appendChild(span)
		if (pos <= contents.length) {
      for (var w = 0; w < parseInt(words); w++) {
        console.log(pos + w)
        p = pos + w + 1
        span.textContent+= contents[p - 1] + ' '
      }
      pos = p
		} else {
			span.textContent = ''
			pos = 0
		}		
	}
})