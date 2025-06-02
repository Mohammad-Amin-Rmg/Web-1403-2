import { writeFile, readFile } from "fs";

  function createRecord(name , family , email){
    readFile('./database.json', 'utf8', (error, data) => {
      if (error) {
        console.log("ERROR:", error);
      }
      else{
  
          let personObject ={
              name: name,
              family: family,
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
  }


  export{
    createRecord
}

