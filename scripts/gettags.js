const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

let promiseArray = [];
for(let i = 1; i < 37; i++) {
  promiseArray.push(axios.get(`https://stackoverflow.com/tags?page=${i}&tab=popular`))
}

axios.all(promiseArray)
  .then(results => {
    let tags = [];
    results.forEach(res => {
      if(res.status === 200) {
        $ = cheerio.load(res.data);
        $('a.post-tag').each(function() {
          tags.push($(this).text());
        });
      }
    });
    return tags;
  })
  .then(tags => {
    fs.writeFileSync('../tags.js', `module.exports = ${JSON.stringify(tags)};`, (err) => {
      if(err) console.log(err);
      console.log('saved file!');
    });
  })
  .catch(err => console.log(err));;
