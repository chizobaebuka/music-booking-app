import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Middleware to authenticate requests
export const authenticateUser = async (
req: Request,
res: Response,
next: NextFunction
): Promise<void> => {
try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded && "email" in decoded && "role" in decoded) {
        req.user = decoded as jwt.JwtPayload & { id: string; email: string; role: "artist" | "organizer"; };
    } else {
        res.status(401).json({ error: "Invalid token payload" });
        return;
    }
    next();
} catch (error) {
    res.status(401).json({ error: "Invalid token" });
}
};

// Middleware to check user roles
export const authorizeRole = (role: "artist" | "organizer") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.user.role !== role) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    };
};