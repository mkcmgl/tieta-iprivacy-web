import toDay from './toDay';
import toHour from './toHour';
import toMinute from './toMinute';
import toMonth from './toMonth';
import toSecond from './toSecond';
import toYear from './toYear';
export default function toTemp(template, date) {
    let result = template;
    if (template.match('Y')) {
        result = result.replace(/Y+/, toYear(date));
    }
    if (template.match('M')) {
        result = result.replace(/M+/, toMonth(date));
    }
    if (template.match('D')) {
        result = result.replace(/D+/, toDay(date));
    }
    if (template.match('h')) {
        result = result.replace(/h+/, toHour(date));
    }
    if (template.match('m')) {
        result = result.replace(/m+/, toMinute(date));
    }
    if (template.match('s')) {
        result = result.replace(/s+/, toSecond(date));
    }
    return result;
}
