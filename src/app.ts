import express from "express";
import helmet from "helmet";
import cors from "cors";
import messageRoutes from "./routes/message.routes";
import statusRoutes from "./routes/status.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", messageRoutes);
app.use("/api", statusRoutes);

app.use(errorHandler);

export default app;