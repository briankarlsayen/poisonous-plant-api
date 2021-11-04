const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_poisonous_plants';
const PORT = 5000;
const app = express();

async function getPlants () {
  try {
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    const elementSelector = '#mw-content-text > div.mw-parser-output > table > tbody > tr'
    const keys = [
      'scientific name',
      'common name',
      'description',
      'img'
    ]
    const plantArr = []
    $(elementSelector).each((parentIndex, parentElement)=> {
      let keyIdx = 0
      const plantObj = {}
      $(parentElement).children().each((childrenIndex, childrenElement) => {
        const tbValue = $(childrenElement).text().replace(/([\[(])(.+?)([\])])/g, "").replace("\n", "")
        const imgValue = $(childrenElement).children().find('img').attr('src')
        plantObj[keys[keyIdx]] = tbValue
        plantObj[keys[3]] = imgValue
        keyIdx++
      })
      return plantArr.push(plantObj)
    })
    plantArr.splice(0,1)
    plantArr.splice(15,1)
    plantArr.pop()
    plantArr.pop()
    return plantArr
  }catch(err) {
    console.log(err)
  }
}
app.get('/', async(req, res) => {
  try {
    const plantData = await getPlants()
    return res.status(200).json(plantData)
  }catch(err) {
    console.log(err)
  }
})
app.listen(PORT, ()=> console.log(`listening to PORT ${PORT}`))