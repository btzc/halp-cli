#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const clui = require('clui');
const argv = require('yargs').argv;
const cheerio = require('cheerio');
const stackoverflow = require('./stackoverflow');
const highlight = require('cli-highlight').highlight;

console.log(argv);
console.log(argv._.join(' '));

// search: https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=reverse%20a%20list%20in%20python&accepted=True&site=stackoverflow
// question with id: https://api.stackexchange.com/2.2/questions/3940128/answers?order=desc&sort=votes&site=stackoverflow
// answer with id: https://api.stackexchange.com/2.2/answers/3940144?order=desc&sort=activity&site=stackoverflow&filter=withbody

const unescapeHtml = (unsafe) => {
  return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'");
}

const parseDOMTree = ($, elems, array_DOM_nodes=[]) => {
  $(elems).each(function(i, elem) {
    if(elem.childNodes) {
      parseDOMTree($, elem.childNodes, array_DOM_nodes)
    } else {
      array_DOM_nodes.push({ "prev_node": elem.parent.name, "data": elem.data.trim() });
    }
  });

  if(!array_DOM_nodes[array_DOM_nodes.length-1].data.includes('\n'))
    array_DOM_nodes[array_DOM_nodes.length-1].data += '\n';

    return array_DOM_nodes;
}

const formatAnswer = (answer) => {
  const { body, score } = answer[0];

  decoded = unescapeHtml(body);
  $ = cheerio.load(decoded);

  let dom_tree = [];

  $('body').children().each(function() {
    const elem_dom = parseDOMTree($, $(this));
    dom_tree = [...dom_tree, ...elem_dom];
  });

  return dom_tree
}

const printAnswer = ( answer ) => {
  pretty_answer = answer.map(node => {
    if(node.prev_node === 'p')
      return node.data;
    else if(node.prev_node === 'code')
      return highlight(node.data, {language: 'python', ignoreIllegals: true});
    else 
      return node.data;
  });

  console.log(pretty_answer.join(' '));
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
  stackoverflow.getAnswer()
    .then((results) => {
      parseAnswers([results]);
    });

  // stackoverflow.getAllAnswers()
  //   .then(function(results) {
  //     parseAnswers(results);
  //   });
}

main();

  // if (argv.ship > 3) {
  //   console.log('Plunder');
  // } else {
  //   console.log('Pls no');
  // }
