const LDAP = require('./ldap');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'LDAP',
  level: 'trace'
});

const authCmd = {
  command: 'auth',
  desc: 'Test Authentication against the given LDAP server using the provided "username" and "password"',
  builder: (yargs) => {
    return yargs
      .option('username', {
        type: 'string',
        demand: 'You must provide the "username" to authenticate',
        nargs: 1,
        describe: 'Username to authenticate'
      })
      .option('password', {
        type: 'string',
        demand: 'You must provide the "password" for the username to authenticate',
        nargs: 1,
        describe: 'Password to authenticate <username> with'
      });
  },
  handler: (argv) => {
    let connectionOptions = getConnectionObject(argv);
    log.info({ connection: connectionOptions }, 'Starting Authenticate Call');
    const ldap = new LDAP(connectionOptions, log);
    ldap.authenticate(argv.username, argv.password, function(err, isAuthenticated) {
      ldap.close();
      if (err) {
        log.error({ err: err }, 'Error running auth command');
      } else {
        log.info({ username: argv.username, isAuthenticated: isAuthenticated }, 'Finished authentication command');
        if (isAuthenticated) {
          log.info('>> ' + argv.username + ' is authenticated');
        } else {
          log.info('>> ' + argv.username + ' is NOT authenticated');
        }
      }
    });
  }
};

const getUserDetails = {
  command: 'user',
  desc: 'Get User Details',
  builder: (yargs) => {
    return yargs.option('username', {
      type: 'string',
      demand: 'You must provide the "username" to get details for',
      nargs: 1,
      describe: 'Username to get details for'
    });
  },
  handler: (argv) => {
    let connectionOptions = getConnectionObject(argv);
    log.info({ connection: connectionOptions }, 'Starting getUserDetails Call');
    const ldap = new LDAP(connectionOptions, log);
    ldap.getUserDetails(argv.username, function(err, details) {
      ldap.close();
      if (err) {
        log.error({ err: err }, 'Error running getUserDetails command');
      } else {
        log.info({ details: details }, 'User Details');
      }
    });
  }
};

const isMemberCmd = {
  command: 'isMember',
  desc: 'Test whether or not the given "username" is a member of the given "group"',
  builder: (yargs) => {
    return yargs
      .option('username', {
        type: 'string',
        demand: 'You must provide the "username" to test group membership of',
        nargs: 1,
        describe: 'Username you want to test group membership of'
      })
      .option('group', {
        type: 'string',
        demand: 'You must provide the "group" that you want to test membership in',
        nargs: 1,
        describe: 'Group name to test membership in'
      });
  },
  handler: (argv) => {
    let connectionOptions = getConnectionObject(argv);
    log.info({ connection: connectionOptions }, 'Starting isMemberOf Call');
    const ldap = new LDAP(connectionOptions, log);
    ldap.isMemberOf(argv.username, argv.group, function(err, isMember) {
      ldap.close();
      if (err) {
        log.error({ err: err }, 'Error running isMemberOf command');
      } else {
        log.info({ username: argv.username, isMember: isMember }, 'Finished isMemberOf command');
        if (isMember) {
          log.info('>> ' + argv.username + ' IS a member of ' + argv.group);
        } else {
          log.info('>> ' + argv.username + ' is NOT a member of ' + argv.group);
        }
      }
    });
  }
};

function getConnectionObject(argv) {
  let config = require(argv.config);
  config.log = log;
  return config;
}

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(authCmd)
  .command(isMemberCmd)
  .command(getUserDetails)
  .option('config', {
    alias: 'c',
    type: 'string',
    nargs: 1,
    describe: 'Path to the config.js file',
    demand: 'You must provide the "config" argument'
  })
  .help()
  .wrap(null)
  .version('LDAP Tester v' + require('./package.json').version)
  // help
  .epilog('(C) 2019 Breach Intelligence Inc. DBA Polarity').argv;
