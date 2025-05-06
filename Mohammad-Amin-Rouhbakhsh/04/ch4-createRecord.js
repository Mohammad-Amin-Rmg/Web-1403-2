import { writeFile, readFile } from "fs";

let name = process.argv[2];
let lastname = process.argv[3];
let email = process.argv[4];

readFile('./database.json', 'utf8', (error, data) => {
    if (error) {
      console.log("ERROR:", error);
    }
    else{

        let personObject ={
            name: name,
            family: lastname,
            email: email
        }

        let objValue = JSON.parse(data);
        objValue.records.push(personObject);

        writeFile('./database.json', JSON.stringify(objValue), (error, data) => {
            if (error) {
              console.log("ERROR:", error);
            }
            else{
                console.log("Record created in database.");
            }
          });

    }
  });



