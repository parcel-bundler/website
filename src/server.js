const program = require('commander');
const express = require('express');
const fs = require('fs');

const app = express();
const languages = fs.readdirSync(__dirname + '/../dist');

program
  .option('-l --locale [locale]', 'Force documentation locale')
  .parse(process.argv);

app.use(function (req, res, next) {
  // autodetect language
  let lang = [program.locale,
      req.query.locale,
   	  req.subdomains[0],
   	  req.acceptsLanguages(...languages),
   	  'en'
	].find(function(lang) {
      return languages.includes(lang);
    });

  req.url = '/' + lang + req.url;
  res.setHeader('Content-Language', lang);
  next();
});

app.use(express.static(__dirname + '/../dist', {
  maxAge: 60000
}));

app.listen(5000);
console.log('Listening on port 5000');
