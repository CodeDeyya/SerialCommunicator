const fs = require("fs");
const std = require("readline");
var flag = false;
var dataArray = [];
var decString = "";
var dataString = "";
var command = "";
var i = 0;
const speed = 400; //Higher speeds can cause data loss simmilar to (1/baudRate)

//initiate communication port with user and driver
const com1 = std.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//converter for converting string to binary packets
const converter = (string) => {
  var buf = Buffer.from(string);
  var message = [];
  for (x of buf.values()) {
    const str = x.toString(2);
    const array = [...str];
    var dif = 8 - array.length;
    for (let i = 0; i < dif; i++) {
      array.unshift("0");
    }
    array.unshift("0");
    array.push("1");
    message.push(...array);
  }
  return message;
};
//Callback function for idle
const listening = () => {
  const com2 = std.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  var command2 = "";
  com2.question("", (reply) => {
    command2 = reply;
    console.log(`[DRIVER] Sending Command ${reply} \\n`);
    com2.close();
  });

  const idle = setInterval(function () {
    fs.writeFileSync("Rx.txt", `1`, "binary");
    if (command2 !== "") {
      if (command2 === "S") {
        console.log("[DRIVER] Command Recognized");
        com2.close();
        sendSerial(converter(command2));
        clearInterval(idle);
      } else {
        console.log("[DRIVER] Command not Recognized");
        clearInterval(idle);
        listening();
      }
    }
  }, speed);
};

//Call back function to send Command
const sendSerial = (Com) => {
  console.log("[DRIVER]  Send Serial");
  var bit = 0;
  const sendCom = setInterval(function () {
    if (bit < 10) {
      fs.writeFileSync("Rx.txt", `${Com[bit]}`, "binary");
    } else {
      clearInterval(sendCom);
      sendEnd();
    }
    bit++;
  }, speed);
};

//Callback function to send /n after every command
const sendEnd = () => {
  var bit = 0;
  var endLine = ["0", "0", "0", "0", "0", "1", "0", "1", "0", "1"];
  const sendCom = setInterval(function () {
    if (bit < 10) {
      fs.writeFileSync("Rx.txt", `${endLine[bit]}`, "binary");
    } else {
      clearInterval(sendCom);
      listening();
    }
    bit++;
  }, speed);
};

//Listening to the TX line of Device
fs.watchFile(
  "Tx.txt",
  {
    bigint: false,
    persistent: true,
    interval: speed,
  },
  (curr, prev) => {
    buf = fs.readFileSync("Tx.txt");
    decString = buf.toString("ascii");
    // console.log("Serial Data", decString);
    //idle State driver keeps sending 1
    if (decString === "1") {
      if (!flag) {
        console.log("[DRIVER] Listening.....");
      }
    }
    //receive initial Start bit 0
    if (decString === "0") {
      if (!flag) {
        flag = true; // set to receive mode
        console.log("[DRIVER] Receiving Data...");
      }
    }

    if (flag) {
      if (i < 9) {
        //receiving the 8 bit data String
        if (i > 0) {
          dataString = dataString.concat(decString);
        }
        i++;
      }
      //Check for stop bit 1
      else if (decString === "1") {
        var data = parseInt(dataString, 2);
        dataArray.push(data);
        console.log("[DRIVER] Received", data);
        if (data === 10) {
          const bufData = Buffer.from(dataArray);
          dataArray = [];
          console.log(
            "[DRIVER] Message is: ",
            bufData,
            bufData.toString("ascii")
          );
        }
        flag = false; // set to listening mode
        dataString = "";
        i = 0;
      } else {
        console.log("[DRIVER] Broken Data");
        flag = false; //set to listening mode
      }
    }
  }
);

//initialize idle function
com1.question("", (reply) => {
  command = reply;
  console.log(`[DRIVER] Sending Command ${reply} \\n`);
  if (reply === "S") {
    com1.close();
  } else {
    console.log("[DRIVER] Command Not Recognized");
    com1.close();
    listening();
  }
});
const idle = setInterval(function () {
  fs.writeFileSync("Rx.txt", `1`, "binary");
  if (command === "S") {
    clearInterval(idle);
    sendSerial(converter(command));
  }
}, speed);
