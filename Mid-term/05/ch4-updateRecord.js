import { writeFile, readFile } from "fs";

let name = process.argv[2];
let lastname = process.argv[3];
let email = process.argv[4];

readFile('./database.json', 'utf8', (error, data) => {
    if (error) {
      console.log("ERROR:", error);
    }
    else{

        let objValue = JSON.parse(data);
        
        for(let object of objValue.records){
            if(name === object.name){

                object.family= lastname;
                object.email = email;

                writeFile('./database.json', JSON.stringify(objValue), (error, data) => {
                    if (error) {
                      console.log("ERROR:", error);
                    }
                    else{
                        console.log("Record Updated successfully in database.");
                    }
                  });

              break;
            }
            else{
                console.log("User not found");
            }
        }    
        

    }
  });



