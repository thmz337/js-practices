import sqlite3 from "sqlite3";
import { run, get } from "./node_sqlite3_wrapper.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const book = await run(db, "INSERT INTO books (title) VALUES ('fjord')");
console.log(book.lastID);
const row = await get(db, "SELECT * FROM books where id = ?", book.lastID);
console.log(row);
await run(db, "DROP TABLE books");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  const book = await run(db, "INSERT INTO books (title) VALUES (NULL)");
  console.log(book.lastID);
} catch (err) {
  console.error(err.message);
}

try {
  const row = await get(db, "SELECT * FROM memos where id = ?", 1);
  console.log(row);
} catch (err) {
  console.error(err.message);
}

await run(db, "DROP TABLE books");
