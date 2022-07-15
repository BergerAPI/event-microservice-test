import {ServiceResponse} from "./types";
import {v4 as uuid} from "uuid"
import {Express} from "../data-source";
import authMiddleware from "../middleware/auth.middleware";

/**
 * This is a sample function that also automatically checks if a user is authenticated
 */
export async function generateUUID(): Promise<ServiceResponse> {
    return {status: 200, content: {error: false, uuid: uuid()}};
}

/**
 * Initializing every route
 */
export function initService() {
    Express.get("/generate-uuid", authMiddleware, async (req, res) => {
        const response = await generateUUID();

        return res.status(response.status).json(response.content);
    });
}