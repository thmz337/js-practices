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

    const id = await run(db, "INSERT INTO books(title) VALUES('fjord')");
    console.log(id);
    const row = await get(db, "SELECT * from books where id = ?", id);
    console.log(row);
  } catch (err) {
    console.error(err);
  } finally {
    await run(db, "DROP TABLE books");
  }
}

successMain();

await timers.setTimeout(100);

async function failTitleMain() {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    const id = await run(db, "INSERT INTO books(title) VALUES(NULL)");
    console.log(id);
    const row = await get(db, "SELECT * from books where id = ?", id);
    console.log(row);
  } catch (err) {
    console.error(err);
  } finally {
    await run(db, "DROP TABLE books");
  }
}

failTitleMain();

await timers.setTimeout(100);

async function failTableMain() {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );

    const id = await run(db, "INSERT INTO books(title) VALUES('fjord')");
    console.log(id);
    const row = await get(db, "SELECT * from memos where id = ?", id);
    console.log(row);
  } catch (err) {
    console.error(err);
  } finally {
    await run(db, "DROP TABLE books");
  }
}

failTableMain();
