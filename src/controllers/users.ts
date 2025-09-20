import type { Request, Response } from "express";
import UsersModel from "../models/users.ts";

export default class UsersController {
    static async getAllUsers(req: Request, res: Response) {
        try{
            const result = await UsersModel.getAllUsers();
            res.status(200).json({
                success: true,
                body: result,
                message: "All users fetched successfully"
            })
            
        }
        catch(err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            })
        }
    }

    static async getUser(req: Request, res: Response) {
        const {user, password} = req.body;
        if(!user || !password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            user
        }
        try{
            const result = await UsersModel.getUser(allowedFields);
            if(result) {
                const {password, ...userWithoutPassword} = result;
                res.status(200).json({
                    success: false,
                    body: userWithoutPassword,
                    message: `user ${result.ID} fetched successfully`
                })
            }
        }
        catch(err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            })
        }
    }

    static async setUser(req: Request, res: Response) {
        let {user, password, role} = req.body;
        // Setting default role 
        role = role || "user"
        // Check if user and password has been sent
        if(!user || !password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const allowedFields = {
            user,
            password,
            role
        }
        try{
            const result = await UsersModel.setUser(allowedFields);
            if(typeof result === "string") {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: result
                })
            } else {
                return res.status(201).json({
                    success: true,
                    body: {
                        ID: result,
                        user,
                        role
                    },
                    message: "User created successfully"
                })
            }
        }
        catch(err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal server error"
            })
        }
    }
}