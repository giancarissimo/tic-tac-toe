import mongoose from 'mongoose'
import envConfig from './config/dotenv.config.js'
const { mongo_url } = envConfig

class DataBase {
  static #instance
  constructor() {
    mongoose.connect(mongo_url)
  }
  static getInstance() {
    if (this.#instance) {
      console.log('Database connection already exists.')
      return this.#instance
    }
    this.#instance = new DataBase()
    console.log('Connection to database successful.')
    return this.#instance
  }
}

const dbInstance = DataBase.getInstance()
export default dbInstance
