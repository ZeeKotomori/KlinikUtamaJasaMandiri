import logger from "../logger/logger.js";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        logger.error(`Error in register: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message : 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).send({ message : 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message : 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        logger.error(`Error in login: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        logger.error(`Error in logout: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}