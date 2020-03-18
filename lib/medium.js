const axios = require('axios').default;

module.exports.fetchArticle = () => {
  return axios.get('https://medium.com/@adnanrahic/hello-world-app-with-node-js-and-express-c1eb7cfa8a30')
    .then(res => {
      return res.data;
    });
}
