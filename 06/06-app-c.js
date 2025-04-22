import {writeFile, readFile} from 'fs';
import {use, start, write} from "./05-httpFramework-f.js";


use('DELETE', 'user', function (request, response) {
    readFile('./users.json', 'utf8', function (error, fileData){
        if(error){
            console.log('ERROR:', error);
            write(response, 500, 'ERROR:' + error);
        }
        else{
            let dataObject = JSON.parse(fileData);
            let found = false;

            for(let i = 0; i < dataObject.records.length; i++){
                if(dataObject.records[i].user === request.data.user){
                    dataObject.records.splice(i,1);
                    found = true;
                }
            }
            let dataString = JSON.stringify(dataObject);

            writeFile('./users.json', dataString, function (error){
                if(error){
                    console.log('ERROR:', error);
                    write(response, 500, 'ERROR:' + error)
                }
                else{

                    if(found){
                        console.log('User Deleted');
                        write(response, 200, 'User Deleted')
                    }
                    else{

                        console.log('User Not Found.');
                        write(response, 400, 'User Not Found.')
                    }
                }
            });
        }
    });
});

start();