document.addEventListener('DOMContentLoaded', () => {
	let contents = []
	let pos = 0
	let speed = document.getElementById('speed').value // secs
	let clock = 0
	let fx = document.getElementById('fx').value

	document.getElementById('speed').addEventListener('change', e => {
		e.preventDefault()
		speed = e.target.value
		cycle()
	})

	document.getElementById('fx').addEventListener('change', e => {
		e.preventDefault()
		fx = e.target.value
	})

	document.getElementById('pasteform').addEventListener('submit', e => {
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