import fs from 'fs'
import { transform } from 'babel-core'

fs.readFile('./check-undefined-function-parameters/test.js', (err, data) => {
  if (err) throw err

  const src = data.toString()
  const out = transform(src, {
    plugins: [
      require('./check-undefined-function-parameters').default,
    ],
  })

  eval(out.code) // eslint-disable-line no-eval

  console.log('OK')
})

fs.readFile('./check-undefined-imports/test.js', (err, data) => {
  if (err) throw err

  const src = data.toString()
  const out = transform(src, {
    plugins: [
      require('./check-undefined-imports').default,
      require('babel-plugin-transform-es2015-modules-commonjs'),
    ],
  })

  console.log(out.code) // eslint-disable-line no-eval

  console.log('OK')
})
