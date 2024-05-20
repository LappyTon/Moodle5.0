const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouters')


const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://kozhydlomark:mark2010@cluster0.v121azw.mongodb.net/Moodle5?retryWrites=true&w=majority&appName=Cluster0`)
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()