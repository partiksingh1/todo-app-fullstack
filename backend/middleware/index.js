const JWT_SECRET = "mysecretkey";
import jwt from "jsonwebtoken";
const authMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send({
            message: "No token provided",
        });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        const decoded = await jwt.verify(token,"mysecretkey");
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(403).send({
            message: "Failed to verify token",
            error:error
        })
    }
}

export default authMiddleware;