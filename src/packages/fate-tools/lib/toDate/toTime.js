import toTemp from './toTemplate';
export default function toTime(date, // ms
template = 'h:m:s') {
    return toTemp(template, Math.floor(date / 1000));
}
