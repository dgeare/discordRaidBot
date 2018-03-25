
// export {initLogger};

import winston from 'winston';

export default function initLogger(){
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({filename: 'error.log', level: 'error'}),
            new winston.transports.File({filename: 'combined.log'})
        ]
    });
    if(process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }
    return logger;
};


// export {initLogger};