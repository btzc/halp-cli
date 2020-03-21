const axios = require('axios').default;

module.exports.fetchArticle = (link) => {
  return axios.get(link)
    .then(res => {
      return res.data;
    });
}
