const chalk = require('chalk');
const terminalLink = require('terminal-link');
const highlight = require('cli-highlight').highlight;

const stackoverflow = require('./stackoverflow');
const domtree = require('./domtree');

const BAD_QUERY_RESPONSE = `Sorry, we were unable to find anything useful for your query. Please try to specify some tags using ${chalk.cyan('-t')}\n
$ halp ${chalk.yellow('reverse a list')} ${chalk.cyan('-t list python')}\n`

const formatCode = (code) => {
  split_code = code.split('\n');

  return `\n\n${split_code.map(split => `    ${split}\n`).join('')}`;
}

const printAnswer = ( answer, lang, question_title ) => {
  pretty_answer = answer.map((node) => {
    if(node.prev_node === 'pre') {
      return highlight(`${formatCode(node.data)}`, {language: lang, ignoreIllegals: true});
    }
    else if(node.prev_node === 'a')
      return terminalLink(chalk.underline.cyan(node.data), node.href);
    else if(node.prev_node === 'code')
      return chalk.yellow(node.data);
    else if(node.prev_node === 'h2')
      return `\n\n${chalk.bold.inverse(node.data)}\n\n`;
    else 
      return node.data;
  });

  console.log(`${chalk.bold.inverse.green(question_title)}\n\n${pretty_answer.join('')}`);
}

const parseAnswers = (answers, lang, question_title) => {
  parsed_answers = [];
  answers.forEach((answer, i) => {
    parsed_answers[i] = domtree.formatAnswer(answer.data.items);
    printed_answer = printAnswer(parsed_answers[i], lang, question_title);
  });

  return parsed_answers;
}

module.exports.interactiveMain = () => {
  stackoverflow.getAllAnswers()
    .then(function(results) {
      parseAnswers(results);
    });
}

module.exports.main = (query, tags, lang) => {
  stackoverflow.getAnswer(query, tags)
    .then(({question_title, answer} = results) => {
      if(!answer) {
        console.log(BAD_QUERY_RESPONSE);
      }
      else {
        parseAnswers([answer], lang, question_title);
      }
    });
}
