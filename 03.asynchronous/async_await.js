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

let wrongStmt;
await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  wrongStmt = await run(db, "INSERT INTO books (title) VALUES (NULL)");
} catch (error) {
  if (error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  await get(db, "SELECT * FROM memos WHERE id = ?", wrongStmt?.lastID);
} catch (error) {
  if (error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await run(db, "DROP TABLE books");
