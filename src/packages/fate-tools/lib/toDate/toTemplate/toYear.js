import toMatch from './toMatch';
export default function toYear(date) {
    return toMatch(date, (date) => date.getFullYear(), 4);
}
