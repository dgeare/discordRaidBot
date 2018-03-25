import path from 'path';

// import winston from 'winston';
import initLogger from './initLogger';
// import prettifyDateString from "./dateUtilities";
// import sortDateStrings from "./dateUtilities";

// import dateUtilities from './dateUtilities';
// let prettifyDateString = dateUtilities.prettifyDateString;
// let sortDateStrings = dateUtilities.sortDateStrings;
import raidBot from './raidBot';
const logger = initLogger(); 
const maxReconnectAttempts = 10;
let bot = raidBot();
let reconnectCounter = 0;//number of reconnection attempts
bot.on('start', (data) => {
    reconnectCounter = 0;
});
// Initialize Discord Bot
bot.on('terminated', (errData) => {
    logger.info(`Bot disconnected with ${errData.code} code. Message : ${errData.errMsg}`);
    if(reconnectCounter++ < maxReconnectAttempts){
        setTimeout(() => {
            bot = raidBot();
        }, 500 * (reconnectCounter**2));
    }
});




