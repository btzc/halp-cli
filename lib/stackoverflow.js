const axios = require('axios').default;

let question_title;

module.exports.getAnswer = (query, tags) => {
  const escaped_query = escape(query);
  const escaped_tags = escape(tags);

  return axios.get(`https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=${escaped_query}&tagged=${escaped_tags}&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)
    .then((res) => {
      if(res.data.items.length === 0) {
        return null;
      }

      const {question_id, title} = res.data.items[0];
      question_title = title;

      return axios.get(`https://api.stackexchange.com/2.2/questions/${question_id}/answers?order=desc&sort=votes&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)
    })
    .then((answers) => {
      if(!answers || answers.data.items.length === 0) {
        return null;
      }
      const {answer_id} = answers.data.items[0];
      
      return axios.get(`https://api.stackexchange.com/2.2/answers/${answer_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody&key=UMuXB0*mDGot3*ShZaCeWQ((`);
    })
    .then((answer) => {
      return {
        "question_title": question_title,
        "answer": answer
      }
    })
    .catch(err => console.log(err));
}

module.exports.getAllAnswers = (query, tags) => {
  const escaped_query = escape(query);
  const escaped_tags = escape(tags);

  return axios.get(`https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=${escaped_query}&tagged=${escaped_tags}&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)
    .then((res) => {
      if(res.data.items.length === 0) {
        return null;
      }

      const { question_id } = res.data.items[0];

      return axios.get(`https://api.stackexchange.com/2.2/questions/${question_id}/answers?order=desc&sort=votes&site=stackoverflow&key=UMuXB0*mDGot3*ShZaCeWQ((`)

    })
    .then((answers) => {
      if(!answers) {
        return null;
      }

      let answer_fetch_promises = [];

      answers.data.items.forEach(({answer_id} = answer) => {
        answer_fetch_promises.push(axios.get(`https://api.stackexchange.com/2.2/answers/${answer_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody&key=UMuXB0*mDGot3*ShZaCeWQ((`));
      });
      
      console.log(answer_fetch_promises);

      return axios.all(answer_fetch_promises);
    })
    .catch((err) => console.log(err));
}


