import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./node_sqlite3_wrapper.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES ('fjord')"))
  .then((book) => {
    console.log(book.lastID);
    return get(db, "SELECT * FROM books where id = ?", book.lastID);
  })
  .then((row) => {
    console.log(row);
  })
  .then(() => {
    run(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (NULL)"))
  .then((book) => {
    console.log(book.lastID);
    return get(db, "SELECT * FROM books where id = ?", book.lastID);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then((id) => {
    console.log(id);
    return get(db, "SELECT * FROM memos where id = ?", id);
  })
  .then((row) => {
    console.log(row);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    run(db, "DROP TABLE books");
  });