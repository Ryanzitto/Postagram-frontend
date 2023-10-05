const express = require('express')
const cors = require('cors')
const userRoute = require('./src/routes/user.route')

const app = express()

app.use(express.json())

const port = 3000

app.use(cors())

app.use("/user", userRoute)

app.listen(port, () => console.log(`Servidor rodando na porta: ${port}`))