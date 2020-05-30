export default function formatDate(timestamp,days,hourss,minutes,seconds){
    if (timestamp==''||timestamp==null) {
        return '';
    } else {
        var date = new Date(timestamp-0);
        var year = date.getFullYear(),
            month = ((date.getMonth()+1) > 9) ? (date.getMonth()+1) : ('0' + (date.getMonth()+1).toString()),
            day = (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate().toString()),
            hours = (date.getHours() > 9) ? date.getHours() : ('0' + date.getHours().toString()),
            minute = (date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes().toString()),
            second = (date.getSeconds() > 9) ? date.getSeconds() : ('0' + date.getSeconds().toString());
        if(seconds) {
            return second;
        }
        if(minutes) {
            return minute;
        }
        if(hourss) {
            return hours;
        } 
        if(days) {
            return day;
        }
        return (year + '-' + month + '-' + day);
    }
}