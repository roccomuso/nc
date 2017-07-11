#!/usr/bin/env node
'use strict'

const fs = require('fs')
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
  waitTime: argv.timeout ? (argv.timeout * 1000) : null,
  protocol: argv.udp ? 'udp' : 'tcp',
  output: argv.output ? fs.createWriteStream(argv.output) : null,
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
    .on('close', exit)
    .on('error', errorExit)
} else if (argv.zero) {
  // port scanner
  debug('Starting port scanner.')
  if (!argv.port) exit('Port/s required', 1)
  var nc2 = new NetcatClient(_common)
  nc2.scan(argv.port, function (out) {
    for (var i in out) {
      console.log(i, '\t', out[i])
    }
  }).on('error', errorExit)
} else {
  // client
  debug('Starting netcat client.')
  _common.timeout = argv.timeout
  _common.interval = argv.interval
  _common.retry = argv.retry ? (argv.retry * 1000) : null
  var nc3 = new NetcatClient(_common)
  if (_common.protocol === 'tcp') nc3.connect()
  else nc3.init() // udp
  nc3.pipe(process.stdout) // nc output to stdout
  process.stdin.pipe(nc3.stream()) // attach incoming pipe
  nc3.on('close', function () {
    if (!_common.retry) exit()
  }).on('error', errorExit)
}

process.stdout.on('error', function (err) {
  console.log('errore su stdout:', err)
})

function sysCmd () {
  return process.platform === 'win32' ? 'cmd.exe ' : '/bin/sh '
}

function exit (msg, code) {
  debug('Exiting.')
  code && console.log(msg || '')
  process.exit(code || 0)
}

function errorExit (msg) {
  return exit(msg, 1)
}
