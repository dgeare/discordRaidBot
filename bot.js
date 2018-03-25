import Discord  from 'discord.io';
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
//logger.remove(logger.transports.Console);
// logger.add(logger.transports.Console, {
//     colorize: true
// });
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
let timeTokens = [
    "3/23/2018 18:30 PDT",
    "3/24/2018 18:00 PDT",
    "3/26/2018 18:30 PDT"
];
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
    console.log('here');
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
                let tdate = new Date(stripped);
                if(isNaN(tdate.getFullYear())){
                    bot.sendMessage({
                        to : channelID,
                        message : "Error, not a valid date string!"
                    });
                }else{
                    timeTokens.push(tdate.toUTCString());
                    timeTokens = sortDateStrings(timeTokens);
                }
                
                break;
            case 'schedule':
                outMessage = `Upcoming raid schedule: \r\n`;
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
                let t = [];
                timeTokens.forEach((item) => {
                    let check = new Date(item);
                    if(now < check){
                        t.push(item);
                    }
                });
                timeTokens = t;
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
    console.log(errMsg);
    console.log(code);
});




function sortDateStrings(arr){
    return arr.sort((a,b) => {
        dateA = new Date(a);
        dateB = new Date(b);
        return dateA - dateB;
    });
}

function prettifyDateString(str){
    let date = new Date(str);
    return date.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday : "short",
        day : "numeric",
        month : "numeric",
        hour : "2-digit",
        minute : "2-digit",
        timeZoneName : "short",
        hour12 : true
    });
}
