import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
  roomId: String,
  public: Boolean,
  player1: {
    name: String,
    wins: Number
  },
  player2: {
    name: String,
    wins: Number
  },
  totalWins: Number,
  winner: String,
  date: { type: Date, default: Date.now }
}, { versionKey: false })

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  matches: [matchSchema],
  date: { type: Date, default: Date.now }
}, { versionKey: false })

const UserModel = mongoose.model("user", userSchema)
export default UserModel
