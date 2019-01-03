const LdapAuth = require('ldapauth-fork');

class Ldap {
  constructor(connectionOptions, log) {
    this.log = log;

    try {
      this.options = connectionOptions;
      this.client = new LdapAuth(connectionOptions);

      // Issue related to https://github.com/mcavage/node-ldapjs/issues/162
      // A failed connection will throw an error if there is no listeners on 'error'.
      // We want to catch and handle the errors.
      this.client._adminClient.on('error', (error) => {
        this.log.trace("ldapClient._adminClient.on('error')");
        this.log.error('LDAP Authentication scheme admin connection had an LDAP client error.');
        this.log.error(error);
      });

      // Issue related to https://github.com/mcavage/node-ldapjs/issues/162
      // A failed connection will throw an error if there is no listeners on 'error'
      // We want to catch and handle the errors.
      this.client._userClient.on('error', (error) => {
        this.log.trace("ldapClient._userClient.on('error')");
        this.log.error('LDAP Authentication scheme user connection had an LDAP client error.');
        this.log.error(error);
      });
    } catch (e) {
      this.log.error({ error: e }, 'Error creating LDAP client.');
    }
  }
  authenticate(username, password, cb) {
    this.log.info({ username: username, password: password }, 'Running LDAP.authenticate');

    //perform the authentication
    this.client.authenticate(username, password, function(err) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, true);
    });
  }
  getUserDetails(identification, cb) {
    const self = this;
    this.log.trace(`ldap.getUserDetails(${identification})`);

    this.client._findUser(identification, (err, user) => {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(`no such user: ${identification}`);
      }

      cb(null, {
        username: identification,
        email: self._getAttribute(user, self.options.userEmailAttribute),
        'full-name': self._getAttribute(user, self.options.userDisplayNameAttribute)
      });
    });
  }
  isMemberOf(username, groupName, cb) {
    const self = this;
    this.log.info({ groupName: groupName }, 'Running LDAP.isMemberOf');

    this.client._findUser(username, (err, user) => {
      if (err) {
        return cb(err);
      }

      if (!user) {
        return cb('The requested user was not found.', false);
      }

      self.client._findGroups(user, (error, userGroups) => {
        if (error) {
          return cb(error);
        }

        this.log.debug({ groups: userGroups._groups }, 'Groups user belongs to');
        cb(null, userGroups._groups.length > 0 ? true : false);
      });
    });
  }
  close() {
    this.client.close();
  }
  _getAttribute(user, option){
    if(typeof user[option] !== 'undefined'){
      return user[option];
    }else{
      return `<attribute '${option}' not found>`;
    }
  }
}

module.exports = Ldap;
