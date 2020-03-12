const cheerio = require('cheerio');

const helpers = require('./helpers');

const parseDOMTree = ($, elems, array_DOM_nodes=[], history = []) => {
  $(elems).each(function(i, elem) {
    if(elem.name === 'code' && elem.parent.name === 'pre') {
      array_DOM_nodes.push(
        { 
          "prev_node": elem.parent.name,
          "data": helpers.unescapeHtml($(elem).html())
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

module.exports.formatAnswer = (answer) => {
  const { body } = answer[0];

  decoded = helpers.unescapeHtml(body);
  $ = cheerio.load(decoded);

  let dom_tree = [];

  $('body').children().each(function() {
    const elem_dom = parseDOMTree($, $(this));
    dom_tree = [...dom_tree, ...elem_dom];
  });

  return dom_tree
}
