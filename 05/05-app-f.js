const {use , start , write} = require("./05-httpframwork-f")
const fs = require('fs')

use("GET", 'sum', (req, res) => {
    let url = req.url.split('/')
    let numbers = url.slice(2)
    let result = 0;


    result = (+(numbers[0]) + +(numbers[1])).toString()
    res.write(result)
    res.end()

})

use("POST", 'sum', (req, res) => {
    let numbers = JSON.parse(req.data)
    let result = numbers.num1 + numbers.num2
    res.write(JSON.stringify(result))
    console.log(result)
    res.end()

})


use( "GET", 'log', (req, res) => {
    if (req.data) {
        let data = JSON.parse(req.data);
        console.log(data);
    } else {
        console.log("No data received");
    }
    res.end()
})


use("GET" , "file" , (req , res) => {
    let url = req.url.split('/')
    let page = url[2];
    console.log(`Requested file: ${page}`);
    if (!page) {
        write(res, 400, "Bad Request: Missing file name");
        res.end();
        return;
    }
    fs.readFile(`./view/${page}` , (err , data) => {
        if(err){
            write(res , 400 , "Server Error: " + err.message);
            res.end();
            return;
        }
        write(res , 200 , data.toString());
        res.end();
    })
})

start()