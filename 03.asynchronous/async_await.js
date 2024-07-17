import sqlite3 from "sqlite3";
import { run, get } from "./node_sqlite3_wrapper.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const stmt = await run(db, "INSERT INTO books (title) VALUES ('fjord')");
console.log(stmt.lastID);
const row = await get(db, "SELECT * FROM books WHERE id = ?", stmt.lastID);
console.log(row);
await run(db, "DROP TABLE books");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

const wrongStmt = await run(
  db,
  "INSERT INTO books (title) VALUES (NULL)",
).catch((err) => console.error(err.message));
if (wrongStmt) {
  console.log(wrongStmt.lastID);
}

const wrongRow = await get(db, "SELECT * FROM memos WHERE id = ?", 1).catch(
  (err) => console.error(err.message),
);
if (wrongRow) {
  console.log(wrongRow);
}

await run(db, "DROP TABLE books");
