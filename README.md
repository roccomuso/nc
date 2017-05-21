# nc [![NPM Version](https://img.shields.io/npm/v/nc.svg)](https://www.npmjs.com/package/nc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Porting Netcat in Node.js. CLI util. :computer:

**Under active development... stay away!**

To embed it in your Node.js app use the [netcat](https://github.com/roccomuso/netcat) package instead. This is meant to be used as a standalone tool.

## What you can do

- [ ] Backdoor (Reverse Shell)
- [ ] Honeypot
- [ ] File transfer
- [ ] Port forwarding
- [ ] Proxy
- [ ] Web Server
- [ ] Port scanning

| OS    |  Supported |
|-------|--------------------|
| Linux | :white_check_mark: |
| Mac OS | :white_check_mark: |
| Windows | :white_check_mark: |

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
-v                   verbose
-w secs              timeout for connects and final net reads (client-side)
-z                   zero-I/O mode [used for scanning]
```

#### Server: Listen for inbound

    $ nc -l -p 2389

#### Client mode

    $ nc localhost 2389

#### Transfer file

| Server side         | Client side                        |
|---------------------|------------------------------------|
| `nc -l 2389 > test` | <code>cat testfile &#124; nc localhost 2389</code> |

#### Timeout support

    $ nc -w 10 localhost 2389

Connection above would be terminated after 10 seconds.

#### Force netcat server to stay up

    $ nc -k -l 2389

In this way the server remains up even if the client got disconnected.

#### Netcat execute

A far more exciting thing to do is to get a quick shell going on a remote machine by using the `-l` or `listen` option and the `-e` or `execute` option. When a connection is made, Netcat executes the program of your choice and connects the `stdin` and `stdout` of the program to the network connection.

    $ nc -l -p 23 -e /bin/bash

#### Retrieve a website Homepage

Let's create a HTTP request file `get.txt` that contains the following line and then a blank
line:

```
GET / HTTP/1.0

```

To use Netcat to retrieve the home page of a web site use:

    $ nc -v www.website.com 80 < get.txt

You will see Netcat make a connection to port 80, send the text contained in the file `get.txt`, and then output the web server's response to `stdout`.

#### Configure netcat client to stay up after EOF

In a normal scenario, if the nc client receives an EOF character then it terminates immediately but this behavior can also be controlled if the -q flag is used. This flag expects a number which depicts number of seconds to wait before client terminates (after receiving EOF).

    $ nc -q 5 localhost 2389

#### UDP Protocol

By default all the sockets that nc utility creates are TCP protocols but this utility also works with UDP protocol. To enable UDP protocol the -u flag is used.

| Server side         | Client side                        |
|---------------------|------------------------------------|
| `nc -u -l 2389` | `nc -u localhost 2389` |

#### Netcat as a Proxy

    $ nc -l -v -p 8088 | nc website.com 80

#### Netcat as a simple udp port scanner

    $ nc -v -z -u 192.168.1.100 1-255

## DEBUG

Debug matches the verbose mode.
You can enable it with the `-v` param or the env var `DEBUG=nc:*`

## Known limitations

None

## Author

Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))
