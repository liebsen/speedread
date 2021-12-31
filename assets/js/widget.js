const e = (a, e, f) => {
  document.getElementById(a).addEventListener(e, ev => {
    f(ev)
  })
}
const anims = ['bounce','flash','pulse','rubberBand','shake','swing','tada','wobble','bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig','fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','flip','flipInX','flipInY','flipOutX','flipOutY','lightSpeedIn','lightSpeedOut','rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight','rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight','slideInDown','slideInLeft','slideInRight','slideOutLeft','slideOutRight','slideOutUp','hinge','rollIn','rollOut']

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
      let anim = fx
      if (anim === 'random') {
        anim = anims[Math.floor(Math.random()*anims.length)]
      }
  		span.classList.add('animated', 'speed', anim)
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
