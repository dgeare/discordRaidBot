import EventEmitter from 'events';
import Discord from 'discord.io';
import { prettifyDateString, sortDateStrings } from './dateUtilities';
import initLogger from './initLogger';
import auth from '../auth.json';
import schedule from './schedule';

let raidSchedule = schedule();
const logger = initLogger(); 

export default function(){
    const e = new EventEmitter();
    
    var bot = new Discord.Client({
        token: auth.token,
        autorun: true
     });
     let timeTokens;

     const commands = [
         {
             command : "addTime",
             description : "Adds a new time to the raid schedule.",
         },
         {
             command : "raid",
             description : "Gives the time until the next scheduled raid.",
         },
         {
             command : "raidTime",
             description : "Alias of !raid.",
         },
         {
             command : "schedule",
             description : "Provides the times of the upcoming raids.",
         },
         {
             command : "gitgud",
             description : "",
         }
     ];
     const easterEggs = {
         "tentaclesimulation" : "OOOOOH! This is what Lago came for!",
         "tentaclestimulation" : "All kinds of stimulating...",
         "missiles" : "Dodging glaciers is hard too.",
         "thewall" : "OUCH! No touchie! The healer lalafell will get mad!"
     };
     bot.on('ready', function (evt) {
        e.emit('started');
        logger.info('Connected');
        logger.info('Logged in as: ');
        logger.info(bot.username + ' - (' + bot.id + ')');
     });
     bot.on('message', function (user, userID, channelID, message, evt) {
         // Our bot needs to know if it will execute a command
         // It will listen for messages that will start with `!`
         if (message.substring(0, 1) == '!') {
             var args = message.substring(1).split(' ');
             var cmd = args[0];
            
             args = args.splice(1);
             let outMessage = ``;
             switch(cmd.toLowerCase()) {
                 case 'commands':
                     outMessage = `Currently Supported Commands: \r\n`;
                     commands.forEach((command) => {
                         outMessage += `${command.command}`;
                         if(command.description){
                             outMessage += ` -- ${command.description}`;
                         }
                         outMessage += `\r\n`;
                     });
                     bot.sendMessage({
                         to : channelID,
                         message : outMessage
                     });
                     break;
                 /** Add new raid time */
                 case 'addtime':
                     let stripped = message.replace(/!addTime +/, "");
                     raidSchedule.addTime(stripped, (err) => {
                         if(err){
                            bot.sendMessage({
                                to : channelID,
                                message : err
                            });
                         }
                     });                     
                     break;
                 case 'schedule':
                     outMessage = `Upcoming raid schedule: \r\n`;
                     timeTokens = raidSchedule.getTimes();
                     timeTokens.forEach((item) => {
                         let prettyDate = prettifyDateString(item);
                         outMessage += `${prettyDate}\r\n`;
                     });
                     bot.sendMessage({
                         to : channelID,
                         message : outMessage
                     });
                     break;
                 /** Get the next raid time */
                 case 'raid':
                 case 'raidtime':
                     let now = new Date();
                     raidSchedule.removeExpired();
                     timeTokens = raidSchedule.getTimes();
                     
                     if(timeTokens.length){
                         let next = new Date(timeTokens[0]);
                         let diff = next - now;
                         diff = diff/1000;
                         let hours = Math.floor(diff/(60 * 60));
                         diff = diff - (hours * 60 * 60);
                         let days = Math.floor(hours/24);
                         hours = hours % 24;
                         let minutes = Math.floor(diff/60);
                         diff = diff - (minutes * 60);
                         let seconds = Math.floor(diff);
                         outMessage = `Next raid in `;
                         if(days > 0){
                             outMessage += `${days} day`+(days > 1 ? `s`:``)+`, `;
                         }
                         outMessage += `${hours} hours, ${minutes} minutes, ${seconds} seconds!`;
                         bot.sendMessage({
                             to : channelID,
                             message : outMessage
                         });
                     }else{
                         bot.sendMessage({
                             to : channelID,
                             message : "no times pending :-("
                         });
                     }
                     break;
                 case 'airforce':
                     bot.sendMessage({
                         to : channelID,
                         message : "Don't pull a Lago!"  
                     });
                     break;
                 case 'gitgud':
                     bot.sendMessage({
                         to : channelID,
                         message : "Have you even *tried*?",
                         embed: {
                             image : {
                                 url : 'http://i.imgur.com/bzQfrJd.jpg'
                             }
                         }
                     });
                     break;
                 default:
                     if(easterEggs[cmd.toLowerCase()]){
                         bot.sendMessage({
                             to : channelID,
                             message : easterEggs[cmd.toLowerCase()]
                         });
                     }
                     break;
              }
          }
     });
     bot.on('disconnect', function(errMsg, code){
        e.emit('terminated', {errMsg : errMsg, code : code});
        logger.info(errMsg);
        logger.info(code);
     });
    
    
    return e;
}
