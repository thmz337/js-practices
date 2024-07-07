#!/usr/bin/env node

import readline from "node:readline";
import minimist from "minimist";
import sqlite3 from "sqlite3";
import Prompt from "./prompt.js";

const db = new sqlite3.Database("memo_app");
const argv = minimist(process.argv.slice(2));

class Memo {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  save() {
    Memo.run("INSERT INTO memos(title, body) VALUES($title, $body)", {
      $title: this.title,
      $body: this.body,
    });
  }

  static delete(id) {
    this.run("DELETE FROM memos WHERE id = ?", id);
  }

  static all(params = []) {
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

  static run(sql, params = []) {
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

async function main() {
  await Memo.run(
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL)",
  );

  const memos = await Memo.all();
  const prompt = new Prompt(memos, argv);

  if (argv["l"]) {
    memos.map((value) => console.log(value.title));
    return;
  }

  if (argv["r"]) {
    if (memos.length !== 0) {
      const answer = await prompt.detailsSelect(
        "Choose a memo you want to see:",
      );
      console.log(answer);
    }
    return;
  }

  if (argv["d"]) {
    if (memos.length !== 0) {
      const answer = await prompt.deleteSelect(
        "Choose a memo you want to delete:",
      );
      await Memo.delete(answer);
    }
    return;
  }

  const lines = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", async function () {
    const memo = new Memo(lines[0], lines.join("\n"));
    await memo.save();
  });
}

main();
