import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import createConnection from './database'
import 'express-async-errors'
import routes from './routes'
import AppErrors from './errors/AppErrors'

createConnection()
const app = express()

app.use(express.json())
app.use(routes)

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    if(err instanceof AppErrors) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    return res.status(500).json({
        status: 'Error',
        message: `Internal server error ${err.message}`
    })
})

export default app