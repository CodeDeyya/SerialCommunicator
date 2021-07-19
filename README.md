# Asynchrounous Communication Demonstrator

# Content

- [Background](#background)
- [Setup](#setup)
- [Improvements](#improvements)
- [Technologies](#technologies)
- [Libraries](#libraries)
- [Time Taken](#time-taken)

# Background

<img src="https://cdn.shopify.com/s/files/1/2702/8766/files/serial.png?v=1515690348" align="right"
     alt="Serial Transmission" >

The following test code depicts the communication between a device and a driver using asynchronous and ASCII based serial communication protocols. The application simulates a driver and device. The user can input commands to the driver which would call for actions from the device.

The two text files Rx and Tx acts as the Rx and Tx of the device. The following picture depicts the wiring diagram of the set up.

The device is a scale which sends stable wight to the driver when requested. The driver sends command S\n to get the stable weight monitored from the scale. The scale once the stable weight is calculated sends the data to the driver.

<p align="center">
  <img src="https://i.ibb.co/N7md6yf/devuce.jpg" alt="Wiring" >
</p>
<!-- toc -->

# Setup

- Clone the project cd/ to project file.
- Run command **npm install** to install all node modules.
- Open two powershells.
- Run command **npm run start-device** on one powershell.
- Run command **npm run start-driver** on the other powershell.
- You will be able to see that both devices are listening to each other.
- To initiate a the command to the device type **S** in the terminal of the driver and press **enter**
- The driver will now send the command **S\n** to the device.
- Once the device registers the command it will respond back with a weight.
- You can send the command again in driver as before to check the latest weight.

# Improvements

- I did not have time to include the simulation of the parity bit as an extra checker for broken data.
- If I had time I would look at standardizing the listening and transmitting function so a common function can be used by both device and driver.
- Only the command S/n is available in the driver even though the commands send to the device is coded such that a variable command can be easily integrated. I didnt have time to add more functionality and commands.
- It would be great if I had time to convert speed to baudRate and simulate the baudRate concept.
- When I change the variable "speed" to values less than 300 the data begins to break as the speed of communication increase. I would like to further analyze the issue and see what improvements can be done.
- If I had the time I would have created a set of commands and a documentation for users to refer.

# Technologies

<p align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/es6/es6.png" alt="Wiring" >
</p>
<p align="center">
  <img src="data:image/png;base64,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" alt="Wiring" >
</p>

# Libraries

- **fs** library used for file handling
- **readline** library used for getting input from user to driver

# Time Taken

I took 4-5 Hours to complete the Task.
