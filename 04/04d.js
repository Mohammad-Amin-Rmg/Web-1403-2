import { createServer } from 'http';

const server = createServer((req, res, data) => {
    req.on('data',(chunck) =>{
        data += chunck;
    })

    req.end('end',()=>{
        try{

            data = JSON.parse(data);
        }
        catch(e){

        }
        router(req,res,data);
    })

})


function router (req , res , data){
    let url = req.url.split('/');
    let command = url[1];
    let input = url.slice(2);

    console.log(req.url);
    console.log(req.methode);
    if (req.method === 'POST' && command === 'sum') {

           let sum = parseInt((+data.input1) + parseInt(+data.input2)).toString()
           res.write(sum);
           res.end();
    }
    else if (req.method === 'GET' && command === 'sum') {
       
            res.write(parseInt((+input[0]) + parseInt(+input[1])).toString());
            res.end();
    }
    else {
        res.write('command not found');
        res.end();
    }


}

server.listen(80);