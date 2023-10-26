let char;

const url = new URL(`https://ENT-DEV-116.github.io/kingdom`);
url.searchParams.append("Charname",char);
const url_string = url.toString();
console.log(url_string);
