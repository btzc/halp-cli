const argv = require('yargs').array('t').alias('t', 'tags').argv;
const chalk = require('chalk');

const halp = require('./halp');
const tags = require('../constants/tags');
const langs = require('../constants/langs');

const HELP = 
`
usage: halp <search query> [-t javascript list]\n
$ halp ${chalk.yellow('center div in another div html\n')}
$ halp ${chalk.yellow('reverse a list')} ${chalk.cyan('-t list python')}\n
`;

const help = () => {
  console.log(HELP);
}

const filterForTags = (query) => {
  filtered = query.filter(maybe_tag => tags.includes(maybe_tag.toLowerCase()));
  
  return `${filtered.join(';')};`;
}

const filterTagsForLang = (tags) => {
  filtered = tags.split(';').filter(maybe_lang => langs.includes(maybe_lang.toLowerCase()));
  
  return filtered ? filtered.join('') : 'javascript';
}

const main = () => {
  if(argv._.length === 0 || argv.h) {
    help();
    process.exit(0);
  }

  const query = argv._.join(' ');
  
  const tags = argv.t ? filterForTags(argv.t) : filterForTags(argv._);
  const lang = filterTagsForLang(tags);
  console.log('\n');

  halp.main(query, tags, lang);
}

main();
