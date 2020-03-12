const axios = require('axios').default;

module.exports.getAnswer = (query, tags) => {
  const escaped_query = escape(query);
  const escaped_tags = escape(tags);

  return axios.get(`https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=${escaped_query}&tagged=${tags}&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)
    .then((res) => {
      const {question_id} = res.data.items[0];

      return axios.get(`https://api.stackexchange.com/2.2/questions/${question_id}/answers?order=desc&sort=votes&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)

    })
    .then((answers) => {
      // console.log(answers.data.items);
      const {answer_id} = answers.data.items[0];
      return axios.get(`https://api.stackexchange.com/2.2/answers/${answer_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody&key=UMuXB0*mDGot3*ShZaCeWQ((`);
    })
    .catch(err => console.log(err));
}

module.exports.getAllAnswers = (query, tags) => {
  const escaped_query = escape(query);
  const escaped_tags = escape(tags);

  return axios.get(`https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=${escaped_query}&tagged=${tags}&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)
    .then((res) => {
      const { question_id } = res.data.items[0];

      return axios.get(`https://api.stackexchange.com/2.2/questions/${question_id}/answers?order=desc&sort=votes&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)

    })
    .then((answers) => {
      let answer_fetch_promises = [];

      answers.data.items.forEach(({answer_id} = answer) => {
        answer_fetch_promises.push(axios.get(`https://api.stackexchange.com/2.2/answers/${answer_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody&key=UMuXB0*mDGot3*ShZaCeWQ((`));
      });
      
      console.log(answer_fetch_promises);

      return axios.all(answer_fetch_promises);
    })
    .catch((err) => console.log(err));
}


