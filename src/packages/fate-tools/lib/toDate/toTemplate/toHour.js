import toMatch from './toMatch';
export default function toHour(date) {
    return toMatch(date, (date) => date instanceof Date ? date.getHours() : Math.floor(date / 3600));
}
