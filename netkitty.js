const net = require('net');
const dgram = require('dgram');
const readline = require('readline');
const args = process.argv.slice(2);
const options = args.filter(arg => arg.startsWith('-')).map(arg => arg.slice(1).split('').filter(chr => chr.length)).flat();
const defaultHost = '127.0.0.1';
const defaultPort = parseInt('nkt', 36);
const [host, port] = args.find(arg => arg.includes(':')).split(':');
const additionalData = args.filter(arg => !arg.includes(':') && !(arg.startsWith('-')));
const argData = additionalData && additionalData.length && additionalData.join(' ') || null;
const tcp = !options.includes('u');
const listening = options.includes('l');
const interactive = options.includes('i');
const userInput = interactive ? readline.createInterface({
  input: process.stdin, output: process.stdout, prompt: ''
}).on('SIGINT', process.exit) : null;
const print = data => console.log(data && data.toString().replace(/\r?\n$/, ''));
if(options.includes('h')) console.log(
`=============== NetKitty ===============
 Netcat, but worse and minimalistic.
 
 usage:
 netkitty [<options...>] [<host/address>]:[<port>] [<data>]
 
 
 options:
  -l {listen} for incoming connections/data on the specified port.
     ignores <data> argument if specified.
  -u Uses {UDP} instead of TCP.
  -i {interactive} mode. keep the connection alive to allow further data transfer.
  -h display this {help}.


     
 default behavior:
  - protocol: TCP
  - sending data (non-listening)
  - non-interactive (close connection after initial data transfer)
  - host/address: 127.0.0.1
  - port: 30557 (base 36 'nkt')
 
 
 remember to always put a colon ':' between <host/address> and port. always.
 even if any of the two are not specified. and don't put any whitespace in between either.
`
);

if(tcp){
  if(listening){
    var tcpServer = net.createServer(conn => {
      if(interactive && userInput){
        userInput.on('line', line => conn.write(line));
        conn.on('data', print);
      }else{
        conn.once('data', data => {
          print(data);
          conn.destroy();
          tcpServer.close();
        });
      }
    }).on('error', console.error).listen(port || defaultPort);
  }else{
    var tcpSocket = net.createConnection(port || defaultPort, host || defaultHost).on('error', console.error);
    tcpSocket.on('data', data => {
      process.stdout.write(data.toString())
    });
    if(argData) tcpSocket.once('ready', () => tcpSocket.write(argData+'\r\n', () => !interactive && tcpSocket.destroy()));
    if(interactive && userInput){
      tcpSocket.on('close', () => userInput.close());
      userInput.on('line', line => tcpSocket.write(line+'\r\n'));
    }
  }
}else{
  if(listening){
    var udpSocket = dgram.createSocket('udp4').bind(port || defaultPort, host, defaultHost, () => {
      udpSocket.on('message', print);
    }).on('error', console.error);
  }else{
    var udpSocket = dgram.createSocket('udp4').on('error', console.error);
    udpSocket.connect(port || defaultPort, host || defaultHost);
    udpSocket.on('message', print);
    if(argData) udpSocket.once('connect', () => udpSocket.send(argData+'\r\n', () => !interactive && udpSocket.close()));
    if(interactive && userInput){
      udpSocket.on('close', () => userInput.close());
      userInput.on('line', line => udpSocket.send(line+'\r\n'));
    }
  }
}