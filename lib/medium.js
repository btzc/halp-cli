const axios = require('axios').default;

module.exports.fetchArticle = () => {
  return axios.get('https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9')
    .then(res => {
      return res.data;
    });
}
