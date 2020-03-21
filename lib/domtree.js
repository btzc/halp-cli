const cheerio = require('cheerio');

const utils = require('./utils');

const returnNodeObject = (elem, history) => {
  const contained_image = history.filter(node => node.name === 'img');

  if (typeof history[0] === 'object' && history[0].name === 'a') {
    return { 
      "prev_node": history[0].name,
      "data": elem.data,
      "href": history[0].href
    };
  } else if(contained_image.length != 0) {
    return {
      "prev_node": contained_image[0].name,
      "src": contained_image[0].src
    };
  } else if(history[0] === 'br' || history[0] === 'hr') {
    return {
      "prev_node": history[0],
      "data": '\n\n'
    };
  }
  else if (history[0] === 'noscript') {
    return;
  } 
  else if (history.includes('figcaption'))
    return {
      "prev_node": 'figcaption',
      "data": elem.data
    };
  else {
    return { 
      "prev_node": history[0] ? history[0] : elem.parent.name,
      "data": elem.data
    };
  }
}

const returnHistoryObject = (elem) => {
  if (elem.name === 'img') {
    return {
      'name': elem.name,
      'src': elem.attribs.src
    };
  } else if (elem.name === 'a') {
    return { 
      'name': elem.name,
      'href': elem.attribs.href
    };
  } else
    return elem.name; 
}

const parseMediumCodeBlock = ($, elem) => {
  let code_string = '';
  $(elem).find('span').each(function(i, span) {
    span.children.forEach(child => {
      if (child.type === 'tag' && child.name === 'br') {
        code_string += '\n';
      } else {
        code_string += $(child).text();
      }
    })
  });

  return utils.unescapeHtml(code_string);
}

const returnCodeObject = ($, elem, source='stackoverflow') => {
  if (source === 'stackoverflow') {
    return { 
      "prev_node": elem.name,
      "data": utils.unescapeHtml($(elem).text())
    };
  } else {
    const data = parseMediumCodeBlock($, elem);
    
    return {
      "prev_node": elem.name,
      "data": data
    };
  }
}

const parseDOMTree = ($, elems, source, array_DOM_nodes=[], history=[]) => {
  $(elems).each(function(i, elem) {
    if (elem.name === 'pre') {
      const code_node = returnCodeObject($, elem, source);
      array_DOM_nodes.push(code_node);

      history = [];
    }
    else if (elem.childNodes && elem.name && elem.childNodes.length !== 0) {
      history.push(returnHistoryObject(elem));
      parseDOMTree($, elem.childNodes, source, array_DOM_nodes, history);
      
      history = [];
    } else {      
      if (elem.name === 'img') {
        history.push(returnHistoryObject(elem));
      }

      if (elem.name === 'br') {
        history.push('br');
      }

      if (elem.name === 'hr') {
        history.push('hr');
      }

      const node = returnNodeObject(elem, history);
      array_DOM_nodes.push(node);

      history = []
    }
  });

  return array_DOM_nodes;
}

module.exports.formatMediumArticle = (article) => {
  const decoded = utils.unescapeHtml(article);
  const $ = cheerio.load(decoded);

  let dom_tree = [];

  $('article > div').children().each(function() {
    const elem_dom = parseDOMTree($, $(this), 'medium');
    dom_tree = [...dom_tree, ...elem_dom];
  });

  return dom_tree;
}

module.exports.formatAnswer = (answer) => {
  const { body } = answer[0];

  const decoded = utils.unescapeHtml(body);
  const $ = cheerio.load(decoded);

  let dom_tree = [];

  $('body').children().each(function() {
    const elem_dom = parseDOMTree($, $(this), 'stackoverflow');
    dom_tree = [...dom_tree, ...elem_dom];
  });

  return dom_tree
}
