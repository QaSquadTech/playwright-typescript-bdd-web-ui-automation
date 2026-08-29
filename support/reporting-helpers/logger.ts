import winston from "winston";

const consoleFormat: any = winston.format.printf(({level, message}: { level: any; message: any }): string => {
    const logLevel: any = winston.format.colorize().colorize(level, `${level.toUpperCase()}`);
    return `[${logLevel}] : ${message}`;
})

//Logger
let logger: any = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.LOG_LEVEL,
            handleExceptions: true,
            format: winston.format.combine(winston.format.timestamp(), consoleFormat)
        })
    ]
})

//print unknown error

logger.on('error', (err: any) => {
    logger.info(`${err.message}`);
})

export default logger;