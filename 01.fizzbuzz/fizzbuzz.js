#!/usr/bin/env node

let fizzbuzz = (number) => {
  if (number % 15 === 0) {
    console.log("FizzBuzz");
  } else if (number % 3 === 0) {
    console.log("Fizz");
  } else if (number % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(number);
  }
};

for (let i = 1; i <= 20; i++) {
  fizzbuzz(i);
}
