import {stat,readFile,readdir} from "fs";

function openFile(name){
    stat(name,(err , stats)=> {
        if (err) {
            console.log("ERROR:", err);
        }
        else{
            if(stats.isDirectory()){
                readdir(`./${name}`, (err, files) => {
                    if (err) {
                        console.log("ERROR:", err);
                    }
                    else {
                        console.log("Current directory filenames:");
                        files.forEach(file => {
                          console.log(file);
                        })
                    }
                })
            }
            else if (stats.isFile()){
                readFile(`./${name}`, (error, data) => {
                    if (error) {
                        console.log("ERROR:", error);
                    }
    
                    console.log(`File Data: ${data}`);
                });
            }
        }
    })
}


export{
    openFile
}