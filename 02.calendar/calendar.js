#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const today = new Date();
let year = today.getFullYear();
let month = today.getMonth();

const make_cal_header = (year, month) => {
  return `
    ${month + 1}月 ${year}
日 月 火 水 木 金 土
`;
};

const make_cal_body = (year, month) => {
  let content = "";
  const first_date = new Date(year, month, 1);
  const last_date = new Date(year, month + 1, 0);

  for (let date = 1; date <= last_date.getDate(); date++) {
    let display_date = date.toString();

    if (display_date.length === 1) {
      display_date = " ".concat(display_date);
    }

    if (new Date(year, month, date).getDay() === 6) {
      display_date = display_date.concat(" \n");
    } else {
      display_date = display_date.concat(" ");
    }

    content = content.concat(display_date);
  }

  content = "   ".repeat(first_date.getDay()).concat(content);
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

process.stdout.write(make_cal_header(year, month));
console.log(make_cal_body(year, month));
