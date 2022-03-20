import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const url = 'https://www.busdoko-oita.jp/map/SpecialRoute/RouteResult?selectLang=en&spId=1&drId=2&stSid=1de41777-3f62-49cf-959a-c73ccd0223db&_=1647759206863';

function getNextBusSchedule(busSchedule: string[]): { nextBusTime: string, nextBusTime2: string } {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  let nextBusTime = '';
  let nextBusTime2 = '';
  for (const time of busSchedule) {
    const [hour, minute] = (time || '').split(':');
    if (parseInt(hour) >= currentHour && parseInt(minute) >= (currentMinute + 5)) {
      if (!!nextBusTime && !!nextBusTime2) break;
      if (!nextBusTime) {
        nextBusTime = time;
      }
      nextBusTime2 = time;
    }
  }
  return { nextBusTime, nextBusTime2 };
}

const parseHTML = (html: string) => {
  const $ = cheerio.load(html);
  const busSchedule: string[] = [];

  const arrivalTimes = $('.arrivalTime');
  arrivalTimes.each((i, el) => {
    busSchedule.push(
      $(el)
        .text()
        .trim(),
    );
  });

  const { nextBusTime, nextBusTime2 } = getNextBusSchedule(busSchedule);
  console.log('busSchedule: ', busSchedule);
  console.log(nextBusTime);
  const onSchedule = !!$('.busStateOnSchedule').text();
  const busArrival = $('.busArrival:has(span)').text();
  const busArrivalTime = (busArrival.match(/\d+/) || [])[0];
  return {
    busNo: 50,
    nextBusTime: nextBusTime,
    nextBusTime2: nextBusTime2,
    onSchedule: onSchedule,
    busArrivalTime: busArrivalTime,
  };


};

const AxiosInstance = axios.create();
async function getData() {
  try {
    const html = await AxiosInstance.get(url);
    const formatted = html.data.replaceAll('\\r\\n', '\n').replaceAll('\\', '');
    return formatted;
  } catch (errors) {
    console.error(errors);
    return null;
  }
}

app.get('/', async (req, res) => {
  const html = await getData();
  if (!html) {
    res.send(503);
  }
  res.json(parseHTML(html));
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
