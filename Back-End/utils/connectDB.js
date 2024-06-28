const mongoose = require('mongoose');

const connectToDB =  async ()=>{
 try {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`MongoDB Connected: ${conn.connection.host}`)
 } catch (error) {
  console.log("dataBase Error : "  , error)
  process.exit(1)
 }
}

module.exports = connectToDB