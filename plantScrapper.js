const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio');
const cors = require('cors')
const app = express();
app.use(cors())

async function getPlants () {
  const url = 'https://en.wikipedia.org/wiki/List_of_poisonous_plants';
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
  const url = 'https://gaming-tools.com/warcraft-3/dota-heroes/';
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
    return err
  }
}
async function getHeroItems () {
  const url = 'https://gaming-tools.com/warcraft-3/dota-items/';
  try{
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    const keys = [
      "image",
      "name",
      "function",
      "sell_price",
      "buy_price",
    ]
    const itemArr = []
    const elementSelector = '#post-12457 > div > div.entry-content > div.su-table.su-table-alternate > table > tbody > tr'
    $(elementSelector).each((parentIndex, parentElement) => {
      let keyIdx = 0
      const itemObj = {}
      $(parentElement).children().each((childrenIndex, childrenElement) => {
        let itemValue
        let itemImg;
        if(childrenIndex >=1) {
          if(keyIdx === 0) {
            itemImg = $(childrenElement).find('img').attr('src')
            itemObj[keys[keyIdx]] = itemImg
          } else {
            itemValue = $(childrenElement).text()
            itemObj[keys[keyIdx]] = itemValue
          }
          keyIdx++
        }

      })
      return itemArr.push(itemObj)
    })
    itemArr.splice(0,1)
    return itemArr
  } catch(err) {
    return err
  }
}

getHeroItems()

async function getCar () {
  const url = 'https://toyota.com.ph/vehicles';
  try{
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    const keys = [
      "name",
      "image",
    ]
    const carArr = []
    const elementSelector = '#nav-vehicle > section'
    $(elementSelector).each((parentIndex, parentElement) => {
      let keyIdx = 0
      $(parentElement).find('div > div > div').each((childrenIndex, childrenElement) => {
        const carObj = {}
        $(childrenElement).children().each((grandchildrenIndex, grandchildrenElement) => {
          const carName = $(childrenElement).find('figcaption').text().replace(/ /g, "").replace(/\n/g, "")
          const carImg = $(childrenElement).find('figure > img').attr('src')
          carObj[keys[0]] = carName
          carObj[keys[1]] = carImg
        })     
        return carArr.push(carObj)
      })
    })
    return carArr
  } catch(err) {
    return err
  }
}

app.get('/plant', async(req, res) => {
  try {
    const plantData = await getPlants()
    return res.status(200).json(plantData)
  }catch(err) {
    return res.status(500).json({message: err})
  }
})
app.get('/dotahero', async(req, res) => {
  try {
    const heroData = await getHero()
    return res.status(200).json(heroData)
  }catch(err) {
    return res.status(500).json({message: err})
  }

})
app.get('/dotaitem', async(req, res) => {
  try {
    const itemData = await getHeroItems()
    return res.status(200).json(itemData)
  }catch(err) {
    return res.status(500).json({message: err})
  }
})

app.get('/car', async(req, res) => {
  try {
    const carData = await getCar()
    return res.status(200).json(carData)
  }catch(err) {
    return res.status(500).json({message: err})
  }
})

app.get('/', (req, res) => {
  res.status(200).send('API online')
})


app.listen(process.env.PORT || 5890, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});