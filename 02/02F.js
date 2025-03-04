let input = process.argv.slice(3);
let command = process.argv[2];

if (command === 'sum') {
    console.log(Number(input[0]) + Number(input[1]));
}
else if (command === 'minus') {

    console.log(Number(input[0]) - Number(input[1]));
}
else if (command === 'print') {     
    let obj = {
        name: input[0],
        family: input[1],
        email: input[2]
    }

    for (key in obj) {
        console.log(`value is ${obj[key]}`);
    }
}
else {
    console.log('Command not found');
}
