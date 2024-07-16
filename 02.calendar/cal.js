#!/usr/bin/env node

import minimist from "minimist";

const makeCalHeader = (year, month) => {
  return `      ${month + 1}月 ${year}
日 月 火 水 木 金 土`;
};

const makeCalBody = (year, month) => {
  let content = "";
  let saturdayCount = 0;
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  content += "   ".repeat(firstDate.getDay());

  for (
    let date = new Date(firstDate.getTime());
    date <= lastDate;
    date.setDate(date.getDate() + 1)
  ) {
    let displayDate = date.getDate().toString();

    if (displayDate.length === 1) {
      displayDate = ` ${displayDate}`;
    }

    if (date.getDay() === 6) {
      displayDate += " \n";
      saturdayCount++;
    } else {
      displayDate += " ";
    }

    content += displayDate;
  }

  if (saturdayCount < 5) {
    content += "\n";
  }
  return content;
};

const argv = minimist(process.argv.slice(2));
const today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
const optionedYear = argv.y;
const optionedMonth = argv.m;

if (
  typeof optionedYear === "number" &&
  optionedYear >= 1970 &&
  optionedYear <= 2100
) {
  year = optionedYear;
}

if (
  typeof optionedMonth === "number" &&
  optionedMonth >= 1 &&
  optionedMonth <= 12
) {
  month = optionedMonth - 1;
}

console.log(makeCalHeader(year, month));
console.log(makeCalBody(year, month));
