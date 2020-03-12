#!/usr/bin/env node
const argv = require('yargs').argv;
const chalk = require('chalk');
const cheerio = require('cheerio');
const stackoverflow = require('./stackoverflow');
const terminalLink = require('terminal-link');
const highlight = require('cli-highlight').highlight;

// search: https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=reverse%20a%20list%20in%20python&accepted=True&site=stackoverflow
// question with id: https://api.stackexchange.com/2.2/questions/3940128/answers?order=desc&sort=votes&site=stackoverflow
// answer with id: https://api.stackexchange.com/2.2/answers/3940144?order=desc&sort=activity&site=stackoverflow&filter=withbody

const unescapeHtml = (unsafe) => {
  return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'");
}

const parseDOMTree = ($, elems, array_DOM_nodes=[], history = []) => {
  $(elems).each(function(i, elem) {
    if(elem.name === 'code' && elem.parent.name === 'pre') {
      array_DOM_nodes.push(
        { 
          "prev_node": elem.parent.name,
          "data": unescapeHtml($(elem).html())
        }
      );

      history = [];
    }
    else if(elem.childNodes) {
      if (elem.name)
        history.push(elem.name === 'a' ? { 'name': elem.name, 'href': elem.attribs.href } : elem.name);
      
        parseDOMTree($, elem.childNodes, array_DOM_nodes, history);
      history = [];
    } else {
      if( typeof history[0] === 'object' ) {
        array_DOM_nodes.push(
          { 
            "prev_node": history[0].name,
            "data": elem.data,
            "href": history[0].href
          }
        ); 
      } else {
        array_DOM_nodes.push(
          { 
            "prev_node": history[0] ? history[0] : elem.parent.name,
            "data": elem.data
          }
        );
      }

      history = []
    }
  });

  return array_DOM_nodes;
}

const formatAnswer = (answer) => {
  const { body } = answer[0];

  decoded = unescapeHtml(body);
  $ = cheerio.load(decoded);

  let dom_tree = [];

  $('body').children().each(function() {
    const elem_dom = parseDOMTree($, $(this));
    dom_tree = [...dom_tree, ...elem_dom];
  });

  return dom_tree
}

const formatCode = (code) => {
  split_code = code.split('\n');
  return `\n\n${split_code.map(split => `    ${split}\n`).join('')}`;
}

const printAnswer = ( answer ) => {
  pretty_answer = answer.map((node) => {
    if(node.prev_node === 'pre') {
      return highlight(`${formatCode(node.data)}`, {language: 'javascript', ignoreIllegals: true});
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

const parseAnswers = (answers) => {
  parsed_answers = [];
  answers.forEach((answer, i) => {
    parsed_answers[i] = formatAnswer(answer.data.items);
    printed_answer = printAnswer(parsed_answers[i]);
  });

  return parsed_answers;
}

const main = () => {
  console.log('\n');
  const query = argv._.join(' ');

  stackoverflow.getAnswer(query)
    .then((results) => {
      parseAnswers([results]);
    });

  // stackoverflow.getAllAnswers()
  //   .then(function(results) {
  //     parseAnswers(results);
  //   });
}

main();
