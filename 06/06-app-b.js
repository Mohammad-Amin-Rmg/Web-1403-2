import {writeFile, readFile} from 'fs';
import {use, start, write} from "./05-httpFramework-f.js";


use('POST', 'user', function (request, response) {
    readFile('./users.json', 'utf8', function (error, fileData){
        if(error){
            console.log('ERROR:', error);
            write(response, 500, 'ERROR:' + error);
        }
        else{
            let dataObject = JSON.parse(fileData);

            for(let item of dataObject.records){
                if(item.user === request.data.user){
                    write(response, 400, 'duplicate user');
                    return;
                }
            }
            dataObject.records.push(request.data);
            let dataString = JSON.stringify(dataObject);

            writeFile('./users.json', dataString, function (error){
                if(error){
                    console.log('ERROR:', error);
                    write(response, 500, 'ERROR:' + error)
                }
                else{
                    console.log('User Created.');
                    write(response, 200, 'User Created.')
                }
            });
        }
    });
});

start();