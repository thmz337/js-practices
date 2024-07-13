import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./wrapper.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run(db, "INSERT INTO books (title) VALUES ('fjord')");
  })
  .then((id) => {
    console.log(id);
    return get(db, "SELECT * FROM books where id = ?", id);
  })
  .then((row) => {
    console.log(row);
  })
  .finally(() => {
    run(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run(db, "INSERT INTO books (title) VALUES (NULL)");
  })
  .catch((err) => {
    console.error(err);
  })
  .then((id) => {
    console.log(id);
    return get(db, "SELECT * FROM memos where id = ?", id);
  })
  .catch((err) => {
    console.error(err);
  })
  .then((row) => {
    console.log(row);
  })
  .finally(() => {
    run(db, "DROP TABLE books");
  });
