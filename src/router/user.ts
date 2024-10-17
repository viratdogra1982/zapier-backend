import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_PASSWORD } from "../config";




const router = Router();




router.post("/signup", async (req: Request, res: Response) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const userExists = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });

    if (userExists) {
        return res.status(403).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

   const user = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            password: hashedPassword,
            name: parsedData.data.name
        }
    });
    return res.json({
        message: "Please login now!"
    });
});




router.post("/signin", async (req: Request, res: Response) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email,
        }
    });
    if (!user) {
        return res.status(403).json({
            message: "Sorry, credentials are incorrect"
        });
    }
    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({
            message: "Sorry, credentials are incorrect"
        });
    }
    const token = jwt.sign({ id: user.id}, JWT_PASSWORD);
    res.json({
        token: token,
    });
});




router.get("/", authMiddleware, async (req: Request, res: Response) => {
         // @ts-ignore
    const id = parseInt(req.id);
    const user = await prismaClient.user.findFirst({
        where: {
            id:id
        },
        select: {
            name: true,
            email: true
        }
    });
    return res.json({user});
});




export const userRouter = router;