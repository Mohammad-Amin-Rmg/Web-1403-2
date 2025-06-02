import { writeFile, readFile } from "fs";

let fileName = process.argv[2];
let bodyData = process.argv.slice(3);

writeFile(`./${fileName}`, JSON.stringify(bodyData), (error, data) => {
    if (error) {
      console.log("ERROR:", error);
    }

    console.log("File Created.");
  });
