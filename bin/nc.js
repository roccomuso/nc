#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const debug = require('debug')('nc')
const netcat = require('netcat')
const NetcatServer = netcat.server
const NetcatClient = netcat.client
const argv = require('../lib/argvHandler.js')

debug('Got argv:', argv)

const _common = {
  address: argv.address,
  port: argv.port,
  keepalive: argv.keepalive,
  verbose: argv.verbose,
  waitTime: argv.timeout ? (argv.timeout * 1000) : null,
  protocol: argv.udp ? 'udp' : 'tcp',
  output: argv.output ? fs.createWriteStream(argv.output) : null,
  unixSocket: argv.unixSocket,
  exec: argv.exec || null
}

if (argv.listen) {
  // server
  debug('Starting netcat server.')
  const nc = new NetcatServer(_common)
  applyCmd(nc)
  nc.listen()
    .serve(process.stdin) // attach incoming pipe
    .pipe(process.stdout) // nc output to stdout
    .on('close', exit)
    .on('error', errorExit)
} else if (argv.zero) {
  // port scanner
  debug('Starting port scanner.')
  if (!argv.port) exit('Port/s required', 1)
  const nc2 = new NetcatClient(_common)
  nc2.scan(argv.port, function (out) {
    for (const i in out) {
      console.log(i, '\t', out[i])
    }
  }).on('error', errorExit)
} else {
  // client
  debug('Starting netcat client.')
  _common.timeout = argv.timeout
  _common.interval = argv.interval
  _common.retry = argv.retry ? (argv.retry * 1000) : null
  const nc3 = new NetcatClient(_common)
  applyCmd(nc3)
  if (_common.protocol === 'tcp') nc3.connect()
  else nc3.init() // udp
  nc3.pipe(process.stdout) // nc output to stdout
  process.stdin.pipe(nc3.stream()) // attach incoming pipe
  nc3.on('close', function () {
    if (!_common.retry) exit()
  }).on('error', errorExit)
}

process.stdout.on('error', function (err) {
  console.log('Error on stdout:', err)
})

// `-c` runs the given command line through a shell, unlike `-e` which execs a program directly.
function applyCmd (nc) {
  if (argv.exec || !argv.cmd || _common.protocol !== 'tcp') return nc
  const [shell, flag] = process.platform === 'win32' ? ['cmd.exe', '/c'] : ['/bin/sh', '-c']
  return nc.exec(shell, [flag, argv.cmd])
}

function exit (msg, code) {
  debug('Exiting.')
  code && console.log(msg || '')
  process.exit(code || 0)
}

function errorExit (msg) {
  return exit(msg, 1)
}
