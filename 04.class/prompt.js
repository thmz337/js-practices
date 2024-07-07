import { select } from "@inquirer/prompts";

export default class Prompt {
  constructor(contents, options = {}) {
    this.contents = contents;
    this.options = options;
  }

  detailsSelect(message) {
    return select({
      message: message,
      choices: this.contents.map((content) => ({
        name: content.title,
        value: content.body,
        description: content.body,
      })),
    });
  }

  deleteSelect(message) {
    return select({
      message: message,
      choices: this.contents.map((content) => ({
        name: content.title,
        value: content.id,
      })),
    });
  }
}
