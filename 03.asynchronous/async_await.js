import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./wrapper.js";

const db = new sqlite3.Database(":memory:");

async function successMain() {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    const id = await run(db, "INSERT INTO books (title) VALUES ('fjord')");
    console.log(id);
    const row = await get(db, "SELECT * FROM books where id = ?", id);
    console.log(row);
  } finally {
    await run(db, "DROP TABLE books");
  }
}

successMain();

await timers.setTimeout(100);

async function failMain() {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    try {
      const id = await run(db, "INSERT INTO books (title) VALUES (NULL)");
      console.log(id);
    } catch (err) {
      console.error(err);
    }

    try {
      const row = await get(db, "SELECT * FROM memos where id = ?", 1);
      console.log(row);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await run(db, "DROP TABLE books");
  }
}

failMain();
