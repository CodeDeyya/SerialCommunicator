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
- I would like to add the ability for the device or driver to recognize that there is no connection to either.
- When the scale is sending the data to driver if the driver requests for another weight the device doesnt respond with a busy statement. I would like to invest more time to look at how this can be itegrated.
- If I had time I would look at standardizing the listening and transmitting function so a common function can be used by both device and driver.
- Only the command S/n is available in the driver even though the commands send to the device is coded such that a variable command can be easily integrated. I didnt have time to add more functionality and commands.
- It would be great if I had time to convert speed to baudRate and simulate the baudRate concept.
- When I change the variable "speed" to values less than 300 the data begins to break as the speed of communication increase. I would like to further analyze the issue and see what improvements can be done.
- If I had the time I would have created a set of commands and a documentation for users to refer.

# Technologies

<p align="center">
  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/es6/es6.png" alt="ES6" >
</p>
<p align="center">
  <img src="https://i.ibb.co/YyKgb2d/download.png" alt="NodeJS" >
</p>

# Libraries

- **fs** library used for file handling
- **readline** library used for getting input from user to driver

# Time Taken

I took 3- 4 Hours to complete the Task. I took around 30 min to test the code and found an issue with registering an unrecognized command in the initial loop. I fixed it and updated in new **update** branch. 
