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
  // check if page exist
  fs.access(`${__dirname}/../dist/${lang}${req.url}`, fs.F_OK, err => {
    if (err) {
      // fallback to `en`
      lang = 'en'
    }
    req.url = `/${lang}${req.url}`
    res.setHeader('Content-Language', lang)
    next()
  })
})

app.use(
  express.static(__dirname + '/../dist', {
    maxAge: 60000
  })
)

app.use(function(req, res, next) {
  // redirect to homepage if page not found
  res.redirect(307, req.protocol + '://' + req.get('host'))
})

app.listen(5000)
console.log('Listening on port http://localhost:5000')
