export var key = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
}

export var mouse = {
  x: 0,
  y: 0
}

export function onkeydown (event) {
  if (event.keyCode == 87) key.w = true
  if (event.keyCode == 83) key.s = true
  if (event.keyCode == 65) key.a = true
  if (event.keyCode == 68) key.d = true
  if (event.keyCode == 32) key.space = true
}

export function onkeyup (event) {
  if (event.keyCode == 87) key.w = false
  if (event.keyCode == 83) key.s = false
  if (event.keyCode == 65) key.a = false
  if (event.keyCode == 68) key.d = false
  if (event.keyCode == 32) key.space = false
}

export function onmousemove (event) {
  mouse.x = event.clientX
  mouse.y = event.clientY
}