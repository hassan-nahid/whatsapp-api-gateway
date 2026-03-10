import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import messageRoutes from "./routes/message.routes";
import statusRoutes from "./routes/status.routes";
import { errorHandler } from "./middleware/errorHandler";
import { sendResponse } from "./utils/response";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", messageRoutes);
app.use("/api", statusRoutes);

app.use((_req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Route not found',
        data: null,
    });
});

app.use(errorHandler);

export default app;