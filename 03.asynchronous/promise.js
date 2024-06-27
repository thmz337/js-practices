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

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run("INSERT INTO books(title) VALUES('fjord')");
  })
  .then((id) => {
    console.log(id);
    return get("SELECT * from books where id = ?", id);
  })
  .then((row) => {
    console.log(row);
  })
  .then(() => {
    run("DROP TABLE books");
  });

await timers.setTimeout(100);

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run("INSERT INTO books(title) VALUES(NULL)");
  })
  .then((id) => {
    console.log(id);
    return get("SELECT * from books where id = ?", id);
  })
  .then((row) => {
    console.log(row);
  })
  .then(() => {
    run("DROP TABLE books");
  })
  .catch((err) => {
    console.error(err);
  });
