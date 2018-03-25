import { prettifyDateString, sortDateStrings } from './dateUtilities';

let timeTokens = [
    "3/24/2018 18:00 PDT",
    "3/26/2018 18:30 PDT",
    "3/28/2018 18:30 PDT"
];

export default function(){
    let addTime = function(str, callback){
        let err = "";
        let tdate = new Date(str);
        if(isNaN(tdate.getFullYear())){
            err = "Error, not a valid date string!";
        }else{
            timeTokens.push(tdate.toUTCString());
            timeTokens = sortDateStrings(timeTokens);
        }
        callback(err === "" ? null : err);
    }

    let getTimes = function(){
        return timeTokens;
    }

    let removeExpired = function(){
        let now = new Date();
        let t = [];
        timeTokens.forEach((item) => {
            let check = new Date(item);
            if(now < check){
                t.push(item);
            }
        });
        timeTokens = t;
    }

    return {
        addTime : addTime,
        getTimes : getTimes,
        removeExpired : removeExpired
    }
}