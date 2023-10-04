const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const userRoute = require('./src/routes/user.route')

app.use("/", userRoute)

app.listen(3000, () => {console.log('ouvindo na porta 3000')})