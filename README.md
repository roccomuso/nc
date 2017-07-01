# nc

[![NPM Version](https://img.shields.io/npm/v/nc.svg)](https://www.npmjs.com/package/nc)
![node](https://img.shields.io/node/v/nc.svg)
[![Dependency Status](https://david-dm.org/roccomuso/nc.png)](https://david-dm.org/roccomuso/nc)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<span class="badge-patreon"><a href="https://patreon.com/roccomuso" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>

Porting Netcat in Node.js. CLI util. :computer:

To embed it in your Node.js app use the [netcat](https://github.com/roccomuso/netcat) package instead. This is meant to be used as a standalone tool, but it's not fully equal to the original implementation of netcat.

| Linux | Mac OS | Windows |
|-------|--------|---------|
| :white_check_mark: | :white_check_mark: | :white_check_mark: |

## What you can do

- [x] TCP & UDP
- [x] Backdoor (Reverse Shell)
- [x] Honeypot
- [x] File transfer
- [x] Port forwarding
- [ ] Proxy
- [x] Web Server & HTTP Client
- [x] Port scanning

## Install

    $ npm install -g nc

## Usage

    $ nc -l -p port [- options] [hostname] [port]

Available options:

```
-c shell commands    as `-e’; use /bin/sh to exec [dangerous!!]
-e filename          program to exec after connect [dangerous!!]
-b                   allow broadcasts
-h                   this cruft
-i secs              delay interval for lines sent, ports scanned
-k set               keepalive option on socket
-l                   listen mode, for inbound connects
-n                   numeric-only IP addresses, no DNS
-o file              hex dump of traffic
-p port              local port number
-r                   randomize local and remote ports
-s addr              local source address
-u                   UDP mode
-U                   Listen or connect to a UNIX domain socket
-v                   verbose
-w secs              timeout for connects and final net reads (client-side)
-z                   zero-I/O mode [used for scanning]
```

#### Server: Listen for inbound

    $ nc -l -p 2389

#### Client mode

    $ nc localhost 2389

Opening a raw connection to port `2389`.

#### Transfer file

| Server side         | Client side                        |
|---------------------|------------------------------------|
| `nc -l 2389 > test` | <code>cat testfile &#124; nc localhost 2389</code> |

#### Timeout support

    $ nc -w 10 localhost 2389

Connection above would be terminated after 10 seconds.

#### Force netcat server to stay up

    $ nc -kl 2389

In this way the server remains up even if the client got disconnected.

#### Netcat execute

A far more exciting thing to do is to get a quick shell going on a remote machine by using the `-l` or `listen` option and the `-e` or `execute` option. When a connection is made, Netcat executes the program of your choice and connects the `stdin` and `stdout` of the program to the network connection.

    $ nc -l -p 23 -e /bin/sh

#### Retrieve a website Homepage

Let's create a HTTP request file `get.txt` that contains the following line and then a blank
line:

```
GET / HTTP/1.0

```

To use Netcat to retrieve the home page of a web site use:

    $ nc -v www.website.com 80 < get.txt

You will see Netcat make a connection to port 80, send the text contained in the file `get.txt`, and then output the web server's response to `stdout`.

#### Configure netcat client to retry on disconnect

In a normal scenario, if the nc client disconnect, it will not retry the connection.
With the `--retry <secs>` or `-R <secs>` param, it will retry the connection after tot seconds.

    $ nc -R 5 localhost 2389

#### Unix socket file

If you have docker, let's try to list our containers' images connecting to the docker unix socket file:

```sh
$ echo -e "GET /images/json HTTP/1.0\r\n" | nc -U /var/run/docker.sock
```

PS. for this example root permissions are required: `sudo su`.

#### Netcat as a Proxy

```sh
$ mkfifo /tmp/fifo
$ nc -l -k -p 8080 </tmp/fifo | nc website.com 80 >/tmp/fifo
```

#### Netcat as a simple port scanner

    $ nc -z 192.168.1.100 1-255

#### Dump hex traffic

If you use the `-o` option you can dump all hex traffic.

    $ nc 127.0.0.1 4445 -o /tmp/log.txt

#### UDP Protocol

By default all the sockets that nc utility creates are TCP protocols but this utility also works with UDP protocol. To enable UDP protocol the -u flag is used.

| Server side         | Client side                        |
|---------------------|------------------------------------|
| `nc -u -l -p 2389` | `nc -u localhost 2389` |

#### Send a UDP message

    $ echo 'message' | nc -w 1 -u 192.168.1.111 514

Pipe via UDP (-u) with a wait time (-w) of 1 second to `192.168.1.111` on port `514`.

## DEBUG

Debug matches the verbose mode.
You can enable it with the `-v` param or the env var `DEBUG=nc`. This module uses the node implementation of [netcat](https://github.com/roccomuso/netcat) under the hood, to debug both use: `DEBUG=netcat:*,nc`.


## Author

Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))
