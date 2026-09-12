import { Router } from "express";

const leadRouter = Router()

leadRouter.post("/", async (req, res) => {
    try {
        const { name, email, company } = req.body;
        if (!name || !email || !company) {
            res.sendStatus(400)
            return
        }
        //todo: add in db
        res.status(201).send({
            message: "Lead stored"
        })
    } catch (e) {
        console.log("errro in storing leads", e)
    }
})

export default leadRouter;