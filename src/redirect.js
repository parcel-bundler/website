const languages = ['en', 'es', 'fr', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'uk', 'zh', 'zh-tw']

module.exports = (req, res) => {
  let splitHostHeaders = req.headers.host.split('.')
  let acceptedLanguages = req.headers['Accept-Language'].split(' ')
  let subdomain = ''
  if (splitHostHeaders.length > 2) {
    subdomain = splitHostHeaders[0]
  }
  let lang = [req.query.locale, subdomain, acceptedLanguages[0], 'en'].find(function(lang) {
    return language.includes(lang)
  })

  res.writeHead('302', { Location: `${lang}.parceljs.org` })
}
