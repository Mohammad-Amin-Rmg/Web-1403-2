import {writeFile, readFile} from 'fs';
import {use, start, write} from "./07-httpframework-a.js";
import crypto from "crypto"
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'mySecretString'
const TOKEN_TIME = 5; //minute
const LOGIN_TIME = TOKEN_TIME * 60


function verifyToken(token){
    try{
        let decoded = jwt.verify(token, JWT_SECRET);
        if((Date.now()/1000 - decoded.iat) / 60 < TOKEN_TIME){
            return true;
        }
        else {
            return false;
        }
    }
    catch(e){
        return false;
    }
}


function parseCookie(cookieString , key){
    if(!cookieString) return null
    const cookies = cookieString.split(';')

     for (const cookie of cookies) {
        const [k , v] = cookie.split('=')
        if(k == key) return v
     }

     return null
}


use('POST', 'sum', function (request, response) {
    if(! verifyToken(parseCookie(request.headers.cookie , "token"))){
        write(response, 400, 'invalid token');
    }
    else{
        console.log((parseInt(request.data.input1) + parseInt(request.data.input2)).toString())
        write(response, 400, (parseInt(request.data.input1) + parseInt(request.data.input2)).toString() ,  `token = ${parseCookie(request.headers.cookie , 'token')}`)
        response.end();
    }
});
use('GET', 'sum', function (request, response) {
    let url = request.url.split('/');
    let inputs = url.slice(2);

    response.write((parseInt(inputs[0]) + parseInt(inputs[1])).toString());
    response.end();
});
use('GET', 'log', function (request, response) {
    console.log('post data is:', request.data);
    response.end();
});
use('GET', 'file', function (request, response) {
    let url = request.url.split('/');
    let inputs = url.slice(2);

    readFile(inputs[0], function (error, fileBody){
        if(error){
            console.log('ERROR:', error);
            write(response, 400, 'ERROR:' + error)
        }
        else{
            response.write(fileBody);
            response.end();
        }
    });
});
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
                    write(response, 400, 'user alrady exists.')
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
use('DELETE', 'user', function (request, response) {
    readFile('./users.json', 'utf8', function (error, fileData){
        if(error){
            console.log('ERROR:', error);
            write(response, 500, 'ERROR:' + error);
        }
        else{
            let dataObject = JSON.parse(fileData);
            let found = false;
            for(let i=0; i<dataObject.records.length; i++){
                if(dataObject.records[i].user === request.data.user){
                    dataObject.records.splice(i,1);
                    found = true;
                }
            }

            if(found){
                let dataString = JSON.stringify(dataObject);
                writeFile('./users.json', dataString, function (error){
                    if(error){
                        console.log('ERROR:', error);
                        write(response, 500, 'ERROR:' + error)
                    }
                    else{
                        console.log('User Deleted.');
                        write(response, 200, 'User Deleted.')
                    }
                });
            }
            else{
                write(response, 400, 'User not found.')
            }
            
        }
    });
});
use('POST', 'token', function (request, response) {
    readFile('./users.json', 'utf8', function (error, fileData){
        if(error){
            console.log('ERROR:', error);
            write(response, 500, 'ERROR:' + error);
        }
        else{

            let dataObject = JSON.parse(fileData);
            let foundIndex = -1;
            let signedToken = null;

            console.log(request.data)

            for(let i=0; i<dataObject.records.length; i++){
                if(dataObject.records[i].user === request.data.user && dataObject.records[i].pass === request.data.pass){
                    foundIndex = i;
                }
            }

            let cookies = []

            if(foundIndex >= 0){
                signedToken = jwt.sign(dataObject.records[foundIndex], JWT_SECRET);
                cookies.push(`token = ${signedToken}; Max-Age =${LOGIN_TIME} `)
                cookies.push(`user = silay!; Max-Age =${LOGIN_TIME} `)
                write(response, 200, JSON.stringify({token: signedToken}) , cookies);
            }
            else{
                write(response, 400, JSON.stringify({
                    message: 'Wrong username and/or password.'
                }))
            }
            
            
        }
    });
});

use('POST', 'todo', function (request, response) {
        
        const dataObject = request.data.text
        console.log(request.data)

        readFile('./todo.json' , (error , data) => {
            if(error){
                return console.log(error)
            }

            const todos = JSON.parse(data)
            const id = crypto.randomUUID()

            todos.items.push({
                text: dataObject,
                id,
                done: false
            })

            writeFile('./todo.json' , JSON.stringify(todos) , (err) => {
                if(err){
                    return console.log(err)
                }

                return write(response , 200 , JSON.stringify({
                    message: "Todo added to database successfuly :))",
                    id
                }) )

            })

        })


})

use('GET', 'todo', function (request, response) {
        

    readFile('./todo.json' , (error , data) => {
        if(error){
            return write(response , 500 , JSON.stringify({
                error
            }))
        }

        const todos = JSON.parse(data).items

        return write(response , 200 , JSON.stringify({
            todos 
        }))


    })


})

start();
