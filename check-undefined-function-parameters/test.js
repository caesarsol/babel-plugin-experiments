function sumFour(a, b, c, d) {
  return a + b + c + d
}

try {
  sumFour(1, 2, 3)
} catch (err) {
  console.assert(err.message === `Undefined function parameter!`)
}

console.assert(sumFour(2, 2, 3, 3) === 10)
