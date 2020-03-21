const argv = require('yargs')
              .help()
              .array('t')
              .alias('t', 'tags').argv;
const chalk = require('chalk');
const googleIt = require('google-it');

const halp = require('./halp');
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

const filterQueryForLang = (query) => {
  filtered = query.filter(maybe_lang => langs.includes(maybe_lang.toLowerCase()));
  
  return filtered.length !== 0 ? filtered[0] : 'javascript';
}

const main = () => {
  if(argv._.length === 0 || argv.h) {
    console.log('inside help');
    help();
    process.exit(0);
  }

  const query = argv._.join(' ');

  const lang = (argv.l || argv.lang) ? (argv.l || argv.lang) : filterQueryForLang(argv._);
  const source = (argv.s || argv.source) ? (argv.s || argv.source) : 'stackoverflow';
  googleIt({'disableConsole': true, 'query': `${query} ${source}`})
    .then(results =>
      results.filter(({ link }) => link.includes(source))
    )
    .then(sources => sources[0])
    .then(({link, title}) => halp.main(lang, link, title, source))
    .catch(err => console.log('We were not able to find any results for your query'));

  console.log('\n');
}

main();
