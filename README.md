# Polarity LDAP Tester

## Overview

The LDAP Tester is a command line tool for testing LDAP settings on Polarity servers.  It provides a simple way to test various LDAP configurations if you are having trouble configuring LDAP from within the Polarity application.  The LDAP Tester tool provides extensive debug logging to assist with configuration.  Once you have determined the correct settings you can apply the settings to your Polarity server.

## Installation

Clone the repo onto your Polarity Server

```
git clone https://github.com/breachintelligence/ldap-tester.git
```

Run `npm install` from inside the cloned ldap-tester folder


```
npm install
```

If you cannot install the dependencies on your sever using `npm isntall` then you can download the full release from the github repo here
https://github.com/breachintelligence/ldap-tester/releases

After downloading the full release, upload the `tgz` file to your Polarity Server and untar it

```
tag -xvzf <file>
```

Note that to run the below commands you may need to make the `ldap-tester.sh` script executable

```
chmod a+x ldap-tester.sh
```

The LDAP tester can be placed anywhere on your Polarity Server and does not need to exist inside `/app`.


## Commands

### General Options

#### --config
The path to the config file.  Note that if using a relative path the path should start with a `.`.  For example,
if your config is located in the root of the ldap-tester folder you would pass the following:

```
./ldap-tester.sh --config ./my-config.js
```

The config file should be a javascript file that exports a config object.  Please see `sample-config.js` for a an example of what the config file should look like as well as a description of all the option values.

### Show Help

```
./ldap-tester.sh --help
```

### Test Authentication for a User

#### --username
The username you want to test authentication for

> Note that the `username` should be formatted so that the search filter as specified by the `searchFilter` option can find the user. Keep in mind the `username` will replace the string `{{username}}` in the search filter.


#### --password
The password for the `username` you want to test authentication for

```
./ldap-tester.sh auth --config <path-to-config> --username <username>  --password <password>
```

Sample values:

```
./ldap-tester.sh auth --config ./my-config.js --username testuser@polarity.local --password h3llo56
```

### Test if User is Member of a Group

#### --username
The username to test

> Note that the `username` should be formatted so that the search filter as specified by the `searchFilter` option can find the user. Keep in mind the `username` will replace the string `{{username}}` in the search filter.

#### --group
The group you want to test membership of the given `username` in

```
./ldap-tester.sh isMember --config <path-to-config> --username <username>  --group <group>
```

Sample values:

```
./ldap-tester.sh isMember --config ./my-config.js --username testuser@breach.local  --group PolarityUsers
```

### Get User Details

#### --username
The username to test

> Note that the `username` should be formatted so that the search filter as specified by the `searchFilter` option can find the user. Keep in mind the `username` will replace the string `{{username}}` in the search filter.

```
./ldap-tester.sh user --config <path-to-config> --username <username>
```

Sample values:

```
./ldap-tester.sh user --config ./my-config.js --username testuser@breach.local
```

This command will output the `email` and `full-name` of the user based on the options `userEmailAttribute` and `userDisplayNameAttribute` as defined in your config file.
