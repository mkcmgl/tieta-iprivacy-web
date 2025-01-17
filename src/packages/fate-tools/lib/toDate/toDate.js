import toTemp from './toTemplate';
export default function toDate(time, template = 'Y-M-D h:m:s') {
    const date = new Date(time);
    return toTemp(template, date);
}
