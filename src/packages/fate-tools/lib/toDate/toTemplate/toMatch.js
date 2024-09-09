export default function toMatch(date, explain, leng = 2, pad = '0') {
    // let str;
    const padStart = (origin) => origin.toString().padStart(leng, pad);
    // if (date instanceof Date) {
    return padStart(explain(date));
    // } else {
    //   str = padStart(date);
    // }
    // return str;
}
