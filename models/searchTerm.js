const mongoose = require('mongoose')
const Schema = mongoose.Schema

const searchTermSchema = new Schema(
  {
    searchVal: String,
    searchDate: Date
  },
  {timeStamps:true}
)

const ModelClass = mongoose.model('searchTerm', searchTermSchema)
module.exports = ModelClass
