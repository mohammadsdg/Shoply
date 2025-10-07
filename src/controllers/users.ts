import type { Request, Response } from "express";
import UsersModel from "../models/users.ts";
import type UserService from "../services/users.ts";

export default class UsersController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService
    }
    getAllUsers = async (req: Request, res: Response) => {
        try{
            const result = await this.userService.getAllUsers();
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

    getUser = async (req: Request, res: Response) => {
        const {username, password} = req.body;
        if(!username || !password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid request"
            })
        }
        const userData = {
            username
        }
        try{
            const result = await this.userService.getUser(userData);
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

    setUser = async (req: Request, res: Response) => {
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
        const userData = {
            user,
            password,
            role
        }
        try{
            const result = await UsersModel.setUser(userData);
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