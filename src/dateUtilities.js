



let sortDateStrings = function(arr){
    return arr.sort((a,b) => {
        let dateA = new Date(a);
        let dateB = new Date(b);
        return dateA - dateB;
    });
}

let prettifyDateString = function(str){
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

export { sortDateStrings, prettifyDateString };