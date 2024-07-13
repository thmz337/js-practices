#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const today = new Date();
let year = today.getFullYear();
let month = today.getMonth();

const makeCalHeader = (year, month) => {
  return `      ${month + 1}月 ${year}
日 月 火 水 木 金 土`;
};

const makeCalBody = (year, month) => {
  let content = "";
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  for (let date = 1; date <= lastDate.getDate(); date++) {
    let displayDate = date.toString();

    if (displayDate.length === 1) {
      displayDate = " ".concat(displayDate);
    }

    if (new Date(year, month, date).getDay() === 6) {
      displayDate = displayDate.concat(" \n");
    } else {
      displayDate = displayDate.concat(" ");
    }

    content = content.concat(displayDate);
  }

  content = "   ".repeat(firstDate.getDay()).concat(content);
  return content;
};

for (const [key, value] of Object.entries(argv)) {
  if (
    key === "y" &&
    typeof value === "number" &&
    value >= 1970 &&
    value <= 2100
  ) {
    year = value;
  }

  if (key === "m" && typeof value === "number" && value >= 1 && value <= 12) {
    month = value - 1;
  }
}

console.log(makeCalHeader(year, month));
console.log(makeCalBody(year, month));
