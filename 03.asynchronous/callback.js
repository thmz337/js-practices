import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES ('fjord')", function () {
      console.log(this.lastID);

      db.get("SELECT * FROM books WHERE id = ?", this.lastID, (_, row) => {
        console.log(row);

        db.run("DROP TABLE books");
      });
    });
  },
);

await timers.setTimeout(100);

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  (err) => {
    if (err === null) {
      db.run("INSERT INTO books (title) VALUES (NULL)", function (err) {
        if (err === null) {
          console.log(this.lastID);
        } else {
          console.error(err.message);
        }

        db.get("SELECT * FROM memos WHERE id = ?", this.lastID, (err, row) => {
          if (err === null) {
            console.log(row);
          } else {
            console.error(err.message);
          }

          db.run("DROP TABLE books", (err) => {
            if (err !== null) {
              console.error(err.messsag);
            }
          });
        });
      });
    } else {
      console.error(err.message);
      return;
    }
  },
);
