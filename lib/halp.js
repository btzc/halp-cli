const chalk = require('chalk');
const terminalLink = require('terminal-link');
const highlight = require('cli-highlight').highlight;

const stackoverflow = require('./stackoverflow');
const medium = require('./medium');
const domtree = require('./domtree');

const BAD_QUERY_RESPONSE = `Sorry, we were unable to find anything useful for your query. Please try to specify some tags using ${chalk.cyan('-t')}\n
$ halp ${chalk.yellow('reverse a list')} ${chalk.cyan('-t list python')}\n`

const formatCode = (code) => {
  split_code = code.split('\n');

  return `\n\n${split_code.map(split => `    ${split}\n`).join('')}\n`;
}

const printAnswer = ( dom_nodes, lang, question_title ) => {
  const filtered_nodes = dom_nodes.filter(node => {
    if(!node)
      return false;

    if (node.prev_node === 'img' && !node.src)
      return false;
    
    if (node.prev_node === 'a' && !node.href)
      return false;
    
    return true;
  });

  let pretty_output = filtered_nodes.map((node) => {
    if(node.prev_node === 'pre') {
      return highlight(`${formatCode(node.data)}`, {language: lang, ignoreIllegals: true});
    }
    else if(node.prev_node === 'img')
      return (`\n\n ${chalk.bgRed("Image Source:")} ${chalk.underline.cyan(node.src)}\n\n`);
    else if(node.prev_node === 'a')
      return terminalLink(chalk.underline.cyan(node.data), node.href);
    else if(node.prev_node === 'code' || node.prev_node === 'em')
      return chalk.yellow(node.data);
    else if(node.prev_node === 'string')
      return chalk.bold(node.data);
    else if(node.prev_node === 'h1' || node.prev_node === 'h2' || node.prev_node === 'h3' || node.prev_node === 'h4')
      return `\n\n${chalk.bold.inverse(node.data)}\n\n`;
    else if(node.prev_node === 'figcaption')
      return `${node.data}\n\n`;
    else 
      return node.data;
  });

  console.log(`${chalk.bold.inverse.green(question_title)}\n\n${pretty_output.join('')}`);
}

const parseAnswers = (answers, lang, question_title) => {
  parsed_answers = [];
  answers.forEach((answer, i) => {
    parsed_answers[i] = domtree.formatAnswer(answer.data.items);
    printAnswer(parsed_answers[i], lang, question_title);
  });
}

module.exports.interactiveMain = () => {
  stackoverflow.getAllAnswers()
    .then(function(results) {
      parseAnswers(results);
    });
}

module.exports.main = (lang, link, title, source='stackoverflow') => {
  if(source === 'medium') {
    medium.fetchArticle(link)
    .then(res => domtree.formatMediumArticle(res))
    .then(article_dom => printAnswer(article_dom, lang, title));
  }
  else {
    const link_split = link.split('/');
    const question_id = link_split[link_split.length - 2];

    stackoverflow.getAnswer(question_id)
      .then(({answer}) => {
        if(!answer) {
          console.log(BAD_QUERY_RESPONSE);
        }
        else {
          parseAnswers([answer], lang, title);
        }
      });
  }
}
