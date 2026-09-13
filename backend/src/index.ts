import express from 'express'
import cors from 'cors'
import leadRouter from './routers/lead.router'
import { config } from './config/env.config'
import { graph } from './langGraph/langGraph'

const app = express()
app.use(express.json())
app.use(cors())


app.use("/api/v1/leads", leadRouter);

try {
    config.validate();
} catch (e) {
    console.log("Setup the required config", e)
}



app.listen(4000, () => {
    console.log("backend in running")
})