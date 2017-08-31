//Get Requirements
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Bing = require('node-bing-api')({accKey: '74a4e4a1be85483bad1d53e23c656cac'})
const searchTerm = require('./models/searchTerm')

app.use(bodyParser.json())
app.use(cors())
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchTerms')

app.get('/api/recentsearches', (req, res, next) => {
  searchTerm.find({},(err, data) => {
    res.json(data)
  })
})

//Get Call
app.get('/api/imagesearch/:searchVal*', (req, res, next) => {
  var { searchVal } = req.params
  var { offset } = req.query

var data = new searchTerm({
  searchVal,
  searchDate: new Date()
});

data.save(err => {
  if (err){
    res.send("Error saving to database")
  }
})

var searchOffset
if (offset){
  if (offset==1){
    offset=0;
    searchOffset = 1
  }
  else if (offset>1){
    searchOffset = offset + 1
  }
}

Bing.images(searchVal,
  {top:(10 * searchOffset),
    skip:(10 * offset)
  }, function(error, rez, body){
  var bingData =[]

for (var i=0; i<10; i++) {
  bingData.push({
      url: body.value[i].webSearchUrl,
        snippet: body.value[i].name,
      thumbnail: body.value[i].thumbnailUrl,
    context: body.value[i].hostPageDisplayUrl
})
}
res.json(bingData)
})
})

app.listen(3000, ()=> {
  console.log("Server is Running")
})
