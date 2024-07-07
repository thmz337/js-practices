#!/usr/bin/env node

import readline from "node:readline";
import minimist from "minimist";
import sqlite3 from "sqlite3";
import Memo from "./memo-class.js";
import Prompt from "./prompt.js";

const db = new sqlite3.Database("memo_app");
const argv = minimist(process.argv.slice(2));

async function main() {
  await Memo.run(
    db,
    "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL)",
  );

  const memos = await Memo.all(db);
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
      await Memo.delete(db, answer);
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
    await memo.save(db);
  });
}

main();
