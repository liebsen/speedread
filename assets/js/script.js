const c = e => {
  return document.createElement(e)
}

const g = e => {
  return document.getElementById(e)
}

const e = (a, e, f) => {
  g(a).addEventListener(e, ev => {
    f(ev)
  })
}

document.addEventListener('DOMContentLoaded', () => {
	let contents = []
	let pos = 0
  let clock = 0
	let speed = g('speed').value // secs
  let mode = g('mode').value
	let fx = g('fx').value

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

	e('fx', 'change', e => {
		e.preventDefault()
		fx = e.target.value
	})

	e('pasteform', 'submit', e => {
		e.preventDefault()
		let text = g('paste').value
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
		const word = g('word')
		const span = c('h1')
		span.classList.add('animated', 'speed', fx)
		word.innerHTML = ''
		word.appendChild(span)
		if (pos <= contents.length) {
			span.textContent = contents[pos]
			pos++
		} else {
			span.textContent = ''
			pos = 0
		}		
	}
})