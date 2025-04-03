import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { signupSchema, loginSchema, userIdSchema, userUpdateSchema } from "../schemas/auth.schema";
import { ZodError } from "zod";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const validatedData = signupSchema.parse(req.body);
            const { user } = await this.authService.signup(validatedData);
            
            res.status(201).json({ message: "User registered", user });
        } catch (error) {
            console.error('Signup error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { token } = await this.authService.login(validatedData);
            
            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error && error.message === "Invalid credentials") {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.authService.getAllUsers();
            console.log({ users })
            res.json({ users });
        } catch (error) {
            console.error('Get all users error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = userIdSchema.parse(req.params.id);
            const user = await this.authService.getUserById(id);
            
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            
            res.json({ user });
        } catch (error) {
            console.error('Get user by ID error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Invalid user ID format" });
                return;
            }
            if (error instanceof Error && error.message === "User not found") {
                res.status(404).json({ error: "User not found" });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = userIdSchema.parse(req.params.id);
            const updateData = userUpdateSchema.parse(req.body);
            const updatedUser = await this.authService.updateUser(id, updateData);
            res.json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error('Update user error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error && error.message === "User not found") {
                res.status(404).json({ error: "User not found" });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = userIdSchema.parse(req.params.id);
            await this.authService.deleteUser(id);
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error('Delete user error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Invalid user ID format" });
                return;
            }
            if (error instanceof Error && error.message === "User not found") {
                res.status(404).json({ error: "User not found" });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };
}

export const authController = new AuthController();
