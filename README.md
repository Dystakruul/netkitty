# Netkitty #
Netcat, but worse and minimalistic.  
A Node.js program for transmitting data between devices.  
 
 ### usage: ###
 `netkitty [<options...>] [<host/address>]:[<port>] [<data>]`
 
 
 ### options: ###
   - `-l` **listen** for incoming connections/data on the specified port.  
   - `-u` Uses **UDP** instead of TCP.
   - `-i` **interactive** mode. keep the connection alive to allow further data transfer.
   - `-h` display this **help**.
     
 ### default behavior: ###
  - protocol: TCP
  - sending data (non-listening)
  - non-interactive (close connection after initial data transfer)
  - host/address: 127.0.0.1
  - port: 30557 *(base 36 'nkt')*
 
 
 *remember to always put a colon ':' between <host/address> and port. always.  
 even if any of the two are not provided. and don't put any whitespace in between either.*
