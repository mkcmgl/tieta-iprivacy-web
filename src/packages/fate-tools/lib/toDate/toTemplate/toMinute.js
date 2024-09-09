import toMatch from './toMatch';
export default function toMinute(date) {
    return toMatch(date, (date) => date instanceof Date ? date.getMinutes() : Math.floor(date / 60) % 60);
}
