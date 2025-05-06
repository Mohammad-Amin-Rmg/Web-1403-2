import { writeFile, readFile } from "fs";

function createFile(name , body){
  console.log(body);
  writeFile(`./${name}`, JSON.stringify(body), (error, data) => {
    if (error) {
      console.log("ERROR:", error);
    }

    console.log("File Created.");
  });
}

  export{
    createFile
}
