const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio');
// const url = 'https://en.wikipedia.org/wiki/List_of_poisonous_plants';
const url = 'https://gaming-tools.com/warcraft-3/dota-heroes/';
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

async function getHero () {
  try{
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    const keys = [
      "image",
      "name",
      "type",
      "playStyle",
      "attack",
      "atkRange",
      "difficulty"
    ]
    const heroArr = []
    const elementSelector = '#post-11639 > div > div.entry-content > div.su-tabs.su-tabs-style-default.su-tabs-mobile-stack > div.su-tabs-panes > div:nth-child(1) > div > table > tbody >tr'
    $(elementSelector).each((parentIndex, parentElement) => {
      let keyIdx = 0
      const heroObj = {}
      $(parentElement).children().each((childrenIndex, childrenElement) => {
        //remove img
        let imgSrc;
        const dotaImg = $(childrenElement).find('img').attr('src')
        if(childrenIndex >= 1){
          const heroValue = $(childrenElement).text()
          heroObj[keys[keyIdx]] = heroValue
          keyIdx++
        }
        if(dotaImg !== undefined){
          heroObj[keys[0]] = dotaImg
        }
      })
      return heroArr.push(heroObj)
    })
    heroArr.splice(0,1)
    return heroArr
  } catch(err) {

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
app.get('/dota', async(req, res) => {
  try {
    const heroData = await getHero()
    return res.status(200).json(heroData)
  }catch(err) {
    console.log(err)
  }
})
app.listen(PORT, ()=> console.log(`listening to PORT ${PORT}`))