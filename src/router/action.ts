import { Router, Request, Response } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available", async (req:Request, res:Response) => {
    const availableActions = await prismaClient.availableAction.findMany({});
    res.json({
        availableActions
    })
});

export const actionRouter = router;