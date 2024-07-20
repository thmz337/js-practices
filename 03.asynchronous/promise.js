import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, get } from "./node_sqlite3_wrapper.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES ('fjord')"))
  .then((stmt) => {
    console.log(stmt.lastID);
    return get(db, "SELECT * FROM books WHERE id = ?", stmt.lastID);
  })
  .then((row) => {
    console.log(row);
    return run(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (NULL)"))
  .then((stmt) => {
    console.log(stmt.lastID);
    return get(db, "SELECT * FROM books WHERE id = ?", stmt.lastID);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then((id) => {
    if (id) {
      console.log(id);
    }
    return get(db, "SELECT * FROM memos WHERE id = ?", id);
  })
  .then((row) => {
    console.log(row);
    return run(db, "DROP TABLE books");
  })
  .catch((err) => {
    console.error(err.message);
  });
