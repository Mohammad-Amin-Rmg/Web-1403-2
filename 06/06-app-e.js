import {writeFile, readFile} from 'fs';
import {use, start, write} from "./05-httpFramework-f.js";
import jwt from 'jsonwebtoken';
//var jwt = require('jsonwebtoken');


use('POST', 'token', function (request, response) {
    readFile('./users.json', 'utf8', function (error, fileData){
        if(error){
            console.log('ERROR:', error);
            write(response, 500, 'ERROR:' + error);
        }
        else{
            let dataObject = JSON.parse(fileData);

            for(let item of dataObject.records){
                if(item.user === request.data.user && item.pass === request.data.pass ){
                    var token = jwt.sign({key: item}, 'amin-secret-key');
                    write(response, 200, JSON.stringify(token));
                }
            }
            let dataString = JSON.stringify(dataObject);

            writeFile('./users.json', dataString, function (error){
                if(error){
                    console.log('ERROR:', error);
                    write(response, 500, 'ERROR:' + error)
                }
                else{

                   
                }
            });
        }
    });
});


start();