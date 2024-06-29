#!/usr/bin/env node

import readline from "node:readline";
import minimist from "minimist";
import { select } from "@inquirer/prompts";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("memo_app");
const argv = minimist(process.argv.slice(2));

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

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, row) => {
      if (err === null) {
        resolve(row);
      } else {
        reject(err);
      }
    });
  });
}

class Memo {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  async save() {
    await run("INSERT INTO memos(title, content) VALUES($title, $content)", {
      $title: this.title,
      $content: this.content,
    });
  }

  static delete(id) {
    run("delete from memos where id = ?", id);
  }

  static all(query) {
    const memos = all(query);
    return memos;
  }
}

async function main() {
  await run(
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)",
  );

  if (argv["l"]) {
    const memos = await Memo.all("SELECT title FROM memos");
    memos.map((value) => console.log(value.title));
    return;
  }

  if (argv["r"]) {
    const memos = await Memo.all("SELECT * FROM memos");

    if (memos.length != 0) {
      const answer = await select({
        message: "Choose a memo you want to see:",
        choices: memos.map((memo) => ({
          name: memo.title,
          value: memo.content,
          description: memo.content,
        })),
      });
      console.log(answer);
    }
    return;
  }

  if (argv["d"]) {
    const memos = await Memo.all("SELECT * FROM memos");

    if (memos.length != 0) {
      const answer = await select({
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo) => ({
          name: memo.title,
          value: memo.id,
        })),
      });
      await Memo.delete(answer);
    }
    return;
  }

  let lines = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    const memo = new Memo(lines[0], lines.join("\n"));
    memo.save();
  });
}

main();
