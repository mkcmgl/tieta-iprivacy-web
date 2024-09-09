import toMatch from './toMatch';
export default function toSecond(date) {
    return toMatch(date, (date) => date instanceof Date ? date.getSeconds() : date % 60);
}
