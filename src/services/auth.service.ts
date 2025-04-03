import { AuthRepository } from "../repositories/auth.repository";;
import { SignupInput, LoginInput, UserUpdateInput } from "../schemas/auth.schema";
import { IUser } from "../models/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
    private authRepo: AuthRepository;

    constructor() {
        this.authRepo = new AuthRepository();
    }

    async signup(input: SignupInput): Promise<{ user: IUser }> {
        const hashedPassword = await argon2.hash(input.password);
        
        const user = await this.authRepo.createUser({
            email: input.email,
            password: hashedPassword,
            role: input.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        return { user };
    }

    async login(input: LoginInput): Promise<{ token: string }> {
        const user = await this.authRepo.findUserByEmail(input.email);
        
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const validPassword = await argon2.verify(user.password, input.password);
        if (!validPassword) {
            throw new Error("Invalid credentials");
        }

        // Include all required fields in the token payload
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, // Add email field
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { token };
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.authRepo.findAll();
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await this.authRepo.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async updateUser(id: string, userData: UserUpdateInput): Promise<IUser> {
        // First check if user exists
        const existingUser = await this.authRepo.findById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        // If updating email, check if new email is already taken
        if (userData.email && userData.email !== existingUser.email) {
            const emailExists = await this.authRepo.findUserByEmail(userData.email);
            if (emailExists) {
                throw new Error("Email already in use");
            }
        }

        const updatedUser = await this.authRepo.updateUser(id, userData);
        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.authRepo.findById(id);
        if (!user) {
            throw new Error("User not found");
        }

        await this.authRepo.deleteUser(id);
    }
}
