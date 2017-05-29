#!/usr/bin/env node
'use strict'

const debug = require('debug')('nc')
const netcat = require('netcat')
const NetcatServer = netcat.server
const NetcatClient = netcat.client
const argv = require('../lib/argvHandler.js')

debug('Got argv:', argv)

var _common = {
  address: argv.address,
  port: argv.port,
  keepalive: argv.keepalive,
  verbose: argv.verbose,
  protocol: argv.udp ? 'udp' : 'tcp',
  unixSocket: argv.unixSocket,
  exec: argv.exec ? argv.exec : (argv.cmd ? sysCmd() + argv.cmd : null)
}

if (argv.listen) {
  // server
  debug('Starting netcat server.')
  var nc = new NetcatServer(_common)
  nc.listen()
    .serve(process.stdin) // attach incoming pipe
    .pipe(process.stdout) // nc output to stdout
  // TODO

} else if (argv.zero) {
  // port scanner
  debug('Starting port scanner.')
  if (!argv.port) exit(1, 'Port/s required')
  var nc2 = new NetcatClient(_common)
  nc2.scan(argv.port, function (out) {
    for (var i in out){
      console.log(i, '\t', out[i])
    }
  })
} else {
  // client
  debug('Starting netcat client.')
  _common.timeout = argv.timeout
  _common.interval = argv.interval

  var nc2 = new NetcatClient(_common)
  nc2.connect()
  process.stdin.pipe(nc2.stream()) // attach incoming pipe
  nc2.pipe(process.stdout) // nc output to stdout
  // TODO

}


function sysCmd () {
  return process.platform === 'win32' ? 'cmd.exe ' : '/bin/sh '
}

function exit(code, msg) {
  debug('Exiting.')
  console.log(msg)
  process.exit(code)
}
