import { writeFile, readFile, readFileSync } from "fs";
import { use, start, write } from "./httpFramework.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "mySecretToken";
const TOKEN_TIME = 30; //seconde

function isValidUser(userPayload) {
  let data = readFileSync("./users.json");
    let dataObject = JSON.parse(data);
    let found = false;
 for(let item of dataObject.records){
 
   if (item.user === userPayload.toString()) {
    return found = true;
   }
 }

if(found){
    return true;
}
else{
    return false;
}


}
function verifyToken(token) {
  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    if (
      Date.now() / 1000 - decoded.iat < TOKEN_TIME &&
      isValidUser(decoded.user)
    ) {
      console.log(decoded.user);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
function parseCookie(cookieString, key) {
  let cookies = "";
  try {
    cookies = cookieString.split(";");
  } catch (e) {
    return "";
  }
  for (let cookie of cookies) {
    let splitted = cookie.split("=");
    if (splitted[0] === key) {
      return splitted[1];
    }
  }
}
function generateId() {
  let randomNumber = Math.floor(Math.random() * 100000000);
  let Id = String(randomNumber).padStart(8, "0");
  return Id;
}
use("GET", "page", function (request, response) {
  let url = request.url.split("/");
  let inputs = url.slice(2);

  readFile(inputs[0], function (error, fileBody) {
    if (error) {
      console.log("ERROR:", error);
      write(response, 404, "File not found :" + error);
    } else {
      write(response, 200, fileBody);
    }
  });
});
use("POST", "api/signup", function (request, response) {
  readFile("./users.json", "utf8", function (error, fileData) {
    if (error) {
      console.log("ERROR:", error);
      write(response, 500, "ERROR:" + error);
    } else {
      let dataObject = JSON.parse(fileData);
      for (let item of dataObject.records) {
        if (item.user === request.data.user) {
          write(response, 403, JSON.stringify("User exists"));
          return;
        }
      }

      dataObject.records.push(request.data);
      let dataString = JSON.stringify(dataObject);

      writeFile("./users.json", dataString, function (error) {
        if (error) {
          console.log("ERROR:", error);
          write(response, 500, "ERROR:" + error);
        } else {
          console.log("Signup done");
          write(response, 200, JSON.stringify("Signup done"));
        }
      });
    }
  });
});
use("POST", "api/login", function (request, response) {
  readFile("./users.json", "utf8", function (error, fileData) {
    if (error) {
      console.log("ERROR:", error);
      write(response, 500, "ERROR:" + error);
    } else {
      let dataObject = JSON.parse(fileData);
      let foundIndex = -1;

      for (let i = 0; i < dataObject.records.length; i++) {
        if (
          dataObject.records[i].user === request.data.user &&
          dataObject.records[i].pass === request.data.pass
        ) {
          foundIndex = i;
        }
      }

      if (foundIndex >= 0) {
        let signedToken = jwt.sign(dataObject.records[foundIndex], JWT_SECRET);
        let cookie = ["token=" + signedToken + "; Max-Age=" + TOKEN_TIME];
        write(response, 200, JSON.stringify("Login done"), cookie);
      } else {
        write(response, 401, JSON.stringify("User not found"));
      }
    }
  });
});
use("POST", "api/article", function (request, response) {
  readFile("./data.json", "utf8", function (error, fileData) {
    if (error) {
      console.log("ERROR:", error);
      write(response, 500, "ERROR:" + error);
    } else {
      let dataObject = JSON.parse(fileData);
      let articleData = {
        id: generateId(),
        title: request.data.title,
        body: request.data.body,
      };
      dataObject.records.push(articleData);
      let dataString = JSON.stringify(dataObject);

      writeFile("./data.json", dataString, function (error) {
        if (error) {
          console.log("ERROR:", error);
          write(response, 500, "ERROR:" + error);
        } else {
          console.log("Article created");
          write(response, 200, JSON.stringify("Article created"));
        }
      });
    }
  });
});
use("DELETE", "api/article", function (request, response) {
  let url = request.url.split("/");
  let inputs = url.slice(3);

  if (!verifyToken(parseCookie(request.headers.cookie, "token"))) {
    write(response, 401, JSON.stringify("Not logged in"));
  } else {
    readFile("./data.json", "utf8", function (error, fileData) {
      if (error) {
        console.log("ERROR:", error);
        write(response, 500, "ERROR:" + error);
      } else {
        let dataObject = JSON.parse(fileData);
        let found = false;
        for (let i = 0; i < dataObject.records.length; i++) {
          if (dataObject.records[i].id === inputs[0]) {
            dataObject.records.splice(i, 1);
            found = true;
          }
        }

        if (found) {
          let dataString = JSON.stringify(dataObject);
          writeFile("./data.json", dataString, function (error) {
            if (error) {
              console.log("ERROR:", error);
              write(response, 500, "ERROR:" + error);
            } else {
              console.log("Article deleted");
              write(response, 200, JSON.stringify("Article deleted"));
            }
          });
        } else {
          write(response, 404, JSON.stringify("Article not found"));
        }
      }
    });
  }
});
use("GET", "api/article", function (request, response) {
  if (!verifyToken(parseCookie(request.headers.cookie, "token"))) {
    write(response, 401, JSON.stringify("Not logged in"));
    console.log(request.headers.cookie);
    console.log(request.headers.cookie);
  } else {
    readFile("./data.json", "utf8", function (error, fileData) {
      if (error) {
        console.log("ERROR:", error);
        write(response, 500, "ERROR:" + error);
      } else {
        write(response, 200, fileData);
      }
    });
  }
});

start();
