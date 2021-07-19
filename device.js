const fs = require("fs");

var decString = "";
var dataString = "";
var dataArray = [];
var i = 0;
var flag = false;
var command = "";
const speed = 400; //Higher speeds can cause data loss simmilar to (1/baudRate)

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

const idleListen = () => {
  const idle = setInterval(function () {
    fs.writeFileSync("Tx.txt", `1`, "binary");
    if (command === "S\n") {
      clearInterval(idle);
      command = "";
      var weight = Math.floor(Math.random() * (300 - 100) + 100);
      var message = `Weight is ${weight.toString()} g`;
      sendSerial(converter(message));
    }
  }, speed);
};

//send End String \n
const sendEnd = () => {
  var bit = 0;
  var endLine = ["0", "0", "0", "0", "0", "1", "0", "1", "0", "1"];
  const sendCom = setInterval(function () {
    if (bit < 10) {
      fs.writeFileSync("Tx.txt", `${endLine[bit]}`, "binary");
    } else {
      idleListen();
      clearInterval(sendCom);
    }
    bit++;
  }, speed);
};

//Listening to the RX line of Device
fs.watchFile(
  "Rx.txt",
  {
    bigint: false,
    persistent: true,
    interval: speed,
  },
  (curr, prev) => {
    buf = fs.readFileSync("Rx.txt");
    decString = buf.toString("ascii");
    // console.log("Serial Data", decString);
    //idle State driver keeps sending 1
    if (decString === "1") {
      if (!flag) {
        console.log("[DEVICE] Listening.....");
      }
    }
    //receive initial Start bit 0
    if (decString === "0") {
      if (!flag) {
        flag = true; // set to receive mode
        console.log("[DEVICE] Receiving Data...");
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
        console.log("[DEVICE] Received", data);
        if (data === 10) {
          const bufData = Buffer.from(dataArray);
          dataArray = [];
          console.log(
            "[DEVICE] Command Recongnized",
            bufData,
            bufData.toString("ascii")
          );
          command = bufData.toString("ascii");
        }
        flag = false; // set to listening mode
        dataString = "";
        i = 0;
      } else {
        console.log("[DEVICE] Broken Data");
        flag = false; //set to listening mode
      }
    }
  }
);

//Call back function to send Command
const sendSerial = (Com) => {
  console.log("[DEVICE] Send Serial");
  var bit = 0;
  const sendCom = setInterval(function () {
    if (bit < Com.length) {
      fs.writeFileSync("Tx.txt", `${Com[bit]}`, "binary");
    } else {
      clearInterval(sendCom);
      sendEnd();
    }
    bit++;
  }, speed);
};

//Function when idle initialize
const idle = setInterval(function () {
  fs.writeFileSync("Tx.txt", `1`, "binary");
  if (command === "S\n") {
    clearInterval(idle);
    command = "";
    var weight = Math.floor(Math.random() * (300 - 100) + 100);
    var message = `Weight is ${weight.toString()} g`;
    sendSerial(converter(message));
  }
}, speed);
