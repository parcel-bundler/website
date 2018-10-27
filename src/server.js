const express = require('express')
const fs = require('fs')

const app = express()
const languages = fs.readdirSync(__dirname + '/../dist')

if (languages.length === 0) {
  console.log("Please run 'npm run build' first.")
  process.exit()
}

app.use(function(req, res, next) {
  // autodetect language
  let lang = [req.query.locale, req.subdomains[0], req.acceptsLanguages(...languages), 'en'].find(function(lang) {
    return languages.includes(lang)
  })

  req.url = '/' + lang + req.url
  res.setHeader('Content-Language', lang)
  next()
})

app.use(
  express.static(__dirname + '/../dist', {
    maxAge: 60000
  })
)

app.listen(5000)
console.log('Listening on port http://localhost:5000')
