const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

axios.get('https://highlightjs.org/static/demo/')
  .then(res => {
    let langs = [];
    if(res.status === 200) {
      $ = cheerio.load(res.data);
      $('div#languages > div > h2').each(function() {
        langs.push($(this).text().toLowerCase());
      });
    }
    return langs;
  })
  .then(langs => {
    fs.writeFileSync('../langs.js', `module.exports = ${JSON.stringify(langs)};`, (err) => {
      if(err) console.log(err);
      console.log('saved file!');
    });
  })
  .catch(err => console.log(err));;
