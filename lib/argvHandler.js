var argv = require('yargs')
  .usage('Usage: nc -v [verbose] -l [listen] -p [port] -k [keepalive] [host] ...')
  .help('help')
  .alias('help', 'h')
  .option('verbose', {
    alias: 'v',
    demand: false,
    describe: 'Verbose Mode (aka Debug mode).',
    type: 'boolean'
  })
  .default('verbose', false)
  .option('listen', {
    alias: 'l',
    demand: false,
    describe: 'Listen mode, for inbound connects',
    type: 'boolean'
  })
  .implies('listen', 'port')
  .option('port', {
    alias: 'p',
    demand: false,
    describe: 'Local port number',
    type: 'number'
  })
  .option('interval', {
    alias: 'i',
    demand: false,
    describe: 'Delay interval for lines sent, ports scanned',
    type: 'number'
  })
  .option('timeout', {
    alias: 'w',
    demand: false,
    describe: 'Timeout for connects and final net reads (client-side)',
    type: 'number'
  })
  .option('retry', {
    alias: 'R',
    demand: false,
    describe: 'Retry connection after a disconnect',
    type: 'number'
  })
  .option('keepalive', {
    alias: 'k',
    demand: false,
    describe: 'Keepalive option on socket',
    type: 'boolean'
  })
  .option('udp', {
    alias: 'u',
    demand: false,
    describe: 'UDP mode',
    type: 'boolean'
  })
  .option('unixSocket', {
    alias: 'U',
    demand: false,
    describe: 'Listen or connect to a UNIX domain socket',
    type: 'string'
  })
  .option('output', {
    alias: 'o',
    demand: false,
    describe: 'Write an Hex dump of incoming or outcoming traffic to the given file',
    type: 'string'
  })
  .option('zero', {
    alias: 'z',
    demand: false,
    describe: 'zero-I/O mode [used for scanning]',
    type: 'boolean'
  })
  .option('cmd', {
    alias: 'c',
    demand: false,
    describe: 'as "-e"; use /bin/sh to exec [dangerous!]',
    type: 'string'
  })
  .option('exec', {
    alias: 'e',
    demand: false,
    describe: 'program to exec after connect [dangerous!]',
    type: 'string'
  })

  .example('nc -l -p 2389', 'Listen on port 2389')
  .example('nc -l 2389 > hello.txt', 'Receive a file')
  .example('cat hello.txt | nc 192.168.1.111 2389', 'Transfer a file to the given host')
  .example('nc -w 10 localhost 2389', 'Connection would be terminated after 10 seconds')
  .example('nc -kl 2389', 'Force netcat server to stay up (using the keepalive param)')
  .example('nc -l -p 23 -e /bin/sh', 'Execute the given program after a successful conn.')
  .example('nc -v www.website.com 80 < get.txt', 'Retrieve a website homepage')
  .example('nc -U /tmp/echo.sock', 'Connect to a UNIX socket file')
  .example('nc -l -p 53 -o dump.txt', 'Traffic hex dump to a file')
  .example('nc -lk -p 8080 </tmp/fifo | nc website.com 80 >/tmp/fifo', 'Netcat as a Proxy')
  .example('nc -vzu 192.168.1.100 1-255', 'Netcat as a simple UDP port scanner')
  .epilogue('@Author: Rocco Musolino - github.com/roccomuso/nc - @Copyright 2017')
  .argv

// <port>
if (argv._.length === 1) argv.port = argv._[0]
else if (argv._.length === 2) {
  // <address> <port>
  argv.address = argv._[0]
  argv.port = argv._[1]
}

module.exports = argv
