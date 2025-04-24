import express from "express";
import { register, login, logout } from "../controllers/authcontroller.js";
import { authenticateToken } from "../middlewares/jwtMiddleware.js";

const authRoute = express.Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.post('/logout', authenticateToken, logout)

export default authRoute;