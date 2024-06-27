import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err === null) {
        resolve(this.lastID);
      } else {
        reject(err);
      }
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err === null) {
        resolve(row);
      } else {
        reject(err);
      }
    });
  });
}

async function successMain() {
  try {
    await run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    const id = await run("INSERT INTO books(title) VALUES('fjord')");
    console.log(id);
    const row = await get("SELECT * from books where id = ?", id);
    console.log(row);

    await run("DROP TABLE books");
  } catch (err) {
    console.error(err);
    return;
  }
}

successMain();

await timers.setTimeout(100);

async function failMain() {
  try {
    await run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    const id = await run("INSERT INTO books(title) VALUES(NULL)");
    console.log(id);
    const row = await get("SELECT * from books where id = ?", id);
    console.log(row);

    await run("DROP TABLE books");
  } catch (err) {
    console.error(err);
    return;
  }
}

failMain();
