import { Router, Request, Response } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available", async (req:Request, res:Response) => {
    const availableTriggers = await prismaClient.availableTrigger.findMany({});
    res.json({
        availableTriggers
    })
});

export const triggerRouter=router;