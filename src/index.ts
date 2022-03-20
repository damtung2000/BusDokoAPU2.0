import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const url = 'https://www.busdoko-oita.jp/map/SpecialRoute/RouteResult?selectLang=en&spId=1&drId=2&stSid=1de41777-3f62-49cf-959a-c73ccd0223db&_=1647759206863';
// const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';
const AxiosInstance = axios.create();
AxiosInstance.get(url)
  .then(
    (response) => {
      const html = response.data;
      const formatted = html.replaceAll('\\r\\n', '\n').replaceAll('\\', '');
      // console.log(formatted);
      const $ = cheerio.load(formatted);
      const busState = $('.busArrival:has(span)').text();
      // const text = $.text();
      console.log(busState);
    },
  )
  .catch(console.error);
app.get('/', (req, res) => {
  res.send('Success');
});

app.listen(5000, () => {
  console.log(`Server listening on port ${5000}`);
});
