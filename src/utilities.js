export { sortDateStrings, prettifyDateString };



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
