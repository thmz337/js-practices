export default class Memo {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  save(db) {
    Memo.run(db, "INSERT INTO memos(title, body) VALUES($title, $body)", {
      $title: this.title,
      $body: this.body,
    });
  }

  static delete(db, id) {
    this.run(db, "DELETE FROM memos WHERE id = ?", id);
  }

  static all(db, params = []) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM memos ORDER BY id desc", params, (err, row) => {
        if (err === null) {
          resolve(row);
        } else {
          reject(err);
        }
      });
    });
  }

  static run(db, sql, params = []) {
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
}
