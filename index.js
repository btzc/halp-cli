#!/usr/bin/env node
const argv = require('yargs').argv;
const chalk = require('chalk');
const terminalLink = require('terminal-link');
const highlight = require('cli-highlight').highlight;

const stackoverflow = require('./stackoverflow');
const domtree = require('./domtree');
const tags = require('./tags');
const langs = require('./langs');

const filterForTags = (query) => {
  filtered = query.filter(maybe_tag => tags.includes(maybe_tag));
  
  return `${filtered.join(';')};`;
}

const filterTagsForLang = (tags) => {
  filtered = tags.split(';').filter(maybe_lang => langs.includes(maybe_lang));
  
  return filtered ? filtered.join('') : 'javascript';
}

const formatCode = (code) => {
  split_code = code.split('\n');

  return `\n\n${split_code.map(split => `    ${split}\n`).join('')}`;
}

const printAnswer = ( answer, lang ) => {
  pretty_answer = answer.map((node) => {
    if(node.prev_node === 'pre') {
      return highlight(`${formatCode(node.data)}`, {language: lang, ignoreIllegals: true});
    }
    else if(node.prev_node === 'a')
      return terminalLink(chalk.underline.blue(node.data), node.href);
    else if(node.prev_node === 'code')
      return chalk.yellow(node.data);
    else if(node.prev_node === 'h2')
      return `\n\n${chalk.bold.inverse(node.data)}\n\n`;
    else 
      return node.data;
  });

  console.log(pretty_answer.join(''));
}

const parseAnswers = (answers, lang) => {
  parsed_answers = [];
  answers.forEach((answer, i) => {
    parsed_answers[i] = domtree.formatAnswer(answer.data.items);
    printed_answer = printAnswer(parsed_answers[i], lang);
  });

  return parsed_answers;
}

const main = () => {
  console.log('\n');
  const query = argv._.join(' ');

  const tags = filterForTags(argv._);
  const lang = filterTagsForLang(tags); 

  stackoverflow.getAnswer(query, tags)
    .then((results) => {
      parseAnswers([results], lang);
    });

  // stackoverflow.getAllAnswers()
  //   .then(function(results) {
  //     parseAnswers(results);
  //   });
}

main();
