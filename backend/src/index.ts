import express from 'express'
import cors from 'cors'
import leadRouter from './routers/lead.router'
import { config } from './config/env.config'
import { graph } from './workflows/enrichment/enrichment.graph'

config.validate();

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/leads", leadRouter);


const res = await graph.invoke({
    rawLead: {
        company: "simplai",
        name: "Tanuj",
        email: "careers@simplai.ai"
    }
})


app.listen(4000, () => {
    console.log("backend in running")
})