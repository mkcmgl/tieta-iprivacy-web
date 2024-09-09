import toMatch from './toMatch';
export default function toMonth(date) {
    return toMatch(date, (date) => date.getMonth() + 1);
}
