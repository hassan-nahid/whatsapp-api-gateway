import {createLogger, format, transports} from "winston";
import path from "path";

const {combine, timestamp, json, errors} = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        errors({stack: true}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        json()
    ),
    transports: [
        new transports.Console({
            format: combine(
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                json()
            ),
        }),
        new transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
        }),
        new transports.File({
            filename: path.join('logs', 'combined.log'),
        }),
    ],
});

export default logger;