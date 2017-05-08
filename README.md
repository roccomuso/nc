# nc [![NPM Version](https://img.shields.io/npm/v/nc.svg)](https://www.npmjs.com/package/nc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Porting Netcat in Node.js. CLI util. :computer:

**Under active development... stay away!**

To embed it on your Node.js app use the [netcat](https://github.com/roccomuso/netcat) package instead. This is meant to be used as a standalone tool.

## What you can do

- [ ] Backdoor (Reverse Shell)
- [ ] Honeypot
- [ ] Port forwarding
- [ ] File transfer
- [ ] Web Server
- [ ] Port scanning
- [ ] Banner grabbing

## Install

    $ npm install -g nc

## Usage

    $ nc -l -p port [- options] [hostname] [port]

Available options:

```
-c shell commands    as `-e’; use /bin/sh to exec [dangerous!!]
-e filename          program to exec after connect [dangerous!!]
-b                   allow broadcasts
-g gateway           source-routing hop point[s], up to 8
-G num               source-routing pointer: 4, 8, 12
-h                   this cruft
-i secs              delay interval for lines sent, ports scanned
-k set               keepalive option on socket
-l                   listen mode, for inbound connects
-n                   numeric-only IP addresses, no DNS
-o file              hex dump of traffic
-p port              local port number
-r                   randomize local and remote ports
-q secs              quit after EOF on stdin and delay of secs
-s addr              local source address
-T tos               set Type Of Service
-t                   answer TELNET negotiation
-u                   UDP mode
-v                   verbose [use twice to be more verbose]
-w secs              timeout for connects and final net reads (client-side)
-z                   zero-I/O mode [used for scanning]
```

#### Listen for inbound
    
    $ nc -l -p port [- options] [hostname] [port]

#### Client mode

    $ nc localhost 2389

#### Transfer file

| Server side         | Client side                        |
|---------------------|------------------------------------|
| `nc -l 2389 > test` | `cat testfile | nc localhost 2389` |

#### Timeout support

    $ nc -w 10 localhost 2389

Connection above would be terminated after 10 seconds.

#### Force netcat server to stay up

    $ nc -k -l 2389

In this way the server remains up even if the client got disconnected.

##### Configure netcat client to stau up after EOF

In a normal scenario, if the nc client receives an EOF character then it terminates immediately but this behavior can also be controlled if the -q flag is used. This flag expects a number which depicts number of seconds to wait before client terminates (after receiving EOF).

    $ nc -q 5 localhost 2389

##### UDP Protocol

By default all the sockets that nc utility creates are TCP protocols but this utility also works with UDP protocol. To enable UDP protocol the -u flag is used.

    $ nc -u -l 2389 # server
    $ nc -u localhost 2389 # client


## DEBUG

Debug matches the verbose mode.
You can enable it with the `-v` param or the env var `DEBUG=nc:*`

## Known limitations

None

## Author

Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))
