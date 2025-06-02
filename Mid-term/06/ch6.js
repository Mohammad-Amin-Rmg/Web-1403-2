import { createFile} from "./ch2-createFile.js";
import { openFile } from "./ch3-open.js";
import { createRecord } from "./ch4-createRecord.js";

let command = process.argv[2];

if(command === 'createFile'){
    createFile(process.argv[3],process.argv[4]);
}
else if (command === 'open'){
    openFile(process.argv[3])
}
else if (command === 'createRecord'){
    createRecord(process.argv[3],process.argv[4],process.argv[5])
}