// import { config } from 'dotenv'
import 'dotenv/config'
import express from "express"
import cookie from 'cookie-parser'
import cors from 'cors'
import userRoutes from './users/user.routes'
import errorMiddleWare from './middlewares/errors.middleware'

// config()
const app = express()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(cookie())


// Routes
app.use('/api', userRoutes)
// Routes

// Errors
app.use(errorMiddleWare)
// Errors


console.log(process.env.NODE_ENV)


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server has been started on port 5000`)
})