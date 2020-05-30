/**
 * Created by kobestyle on 16/11/18.
 */

let date_reg_all = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,
  date_reg_year_month = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])$/,
  date_reg_year_month_date = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1])$/,
  date_reg_year_month_date_hour = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3])$/,
  date_reg_year_month_date_hour_minute = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/;

function format(date, format) {
  let now = toJsDate(date),
    year = now.getFullYear(),
    month = (now.getMonth() + 1),
    day = now.getDate(),
    hour = now.getHours(),
    minute = now.getMinutes(),
    second = now.getSeconds(),
    result, fill = function (val) {
      return (val < 10 ? '0' : '') + val;
    };
  month = fill(month);
  day = fill(day);
  hour = fill(hour);
  minute = fill(minute);
  second = fill(second);

  switch (format) {
    case 'YYMMDD':
      result = year + month + day;
      break;
    case 'YYMMDD-HHMM':
      result = year + month + day + '-' + hour + minute;
      break;
    case 'YY-MM':
      result = year + '-' + month;
      break;
    case 'MM-DD':
      result = month + '-' + day;
      break;
    case 'YY-MM-DD':
      result = year + '-' + month + '-' + day;
      break;
    case 'YY-MM-DD HH:MM:SS':
      result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      break;
    case 'YY-MM-DD HH:MM':
      result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      break;
    case 'YY/MM/DD HH:MM':
      result = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
      break;
    case 'HH:MM':
      result = hour + ':' + minute;
      break;
    case 'HH:MM:SS':
      result = hour + ':' + minute + ':' + second;
      break;
    case 'YYMMDDHHMMSS':
      result = year + month + day + hour + minute + second;
      break;
    default:
      result = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
  }
  return result;
}

function toJsDate(date) {
  if (!isDate(date)) {
    return new Date();
  }
  if (typeof date === 'string') {
    if (/^\d{11,}$/.test(date)) {
      return new Date(+date);
    }
    date = date.replace(/-/g, '\/');
    if (date_reg_year_month.test(date)) {
      date += '/01';
    }
  }
  return new Date(date);
}

function isDate(date) {
  if (!date || date === null) {
    return false;
  }
  let newDate;
  if (typeof date === 'string') {
    if (/^\d{11,}$/.test(date)) {
      newDate = new Date(+date);
      return newDate != 'Invalid Date';
    }
    return date_reg_all.test(date) ||
      date_reg_year_month.test(date) ||
      date_reg_year_month_date.test(date) ||
      date_reg_year_month_date_hour.test(date) ||
      date_reg_year_month_date_hour_minute.test(date);
  }
  newDate = new Date(date);
  return newDate != 'Invalid Date';
}



export default format;
