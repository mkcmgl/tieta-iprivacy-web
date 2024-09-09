import toMatch from './toMatch';
export default function toDay(date) {
    return toMatch(date, (date) => date.getDate());
}
