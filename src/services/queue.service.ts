import PQueue from "p-queue";
import logger from "../config/logger";

const concurrency = parseInt(process.env.QUEUE_CONCURRENCY || "5", 10);

const queue = new PQueue({ concurrency});

export const addToQueue = (fn: () => Promise<any>): Promise<void> => {
    return queue.add(fn).catch((error) => {
        logger.error('Queue task failed', { error: error.message });
        throw error;
    }) as Promise<void>;
}