module.exports = {
    /**
     * Server URL (including ldaps:// or ldap://)
     */
    url: "ldaps://127.0.0.1",
    /**
     * Service User Bind Attribute
     */
    bindProperty: "dn",
    /**
     * Service User DN
     */
    bindDn: "cn=PolarityServiceUser,ou=ServiceAccounts,dc=domain,dc=com",
    /**
     * Service User Password
     */
    bindCredentials: "password1234",
    /**
     * User Search Base
     */
    searchBase: "ou=Analysts,ou=Users,dc=domain,dc=com",
    /**
     * User Search Filter
     */
    searchFilter: "(&(objectCategory=User)(sAMAccountName={{username}}))",
    /**
     * Group Search Base
     */
    groupSearchBase: "ou=UserGroups,ou=Groups,dc=domain,dc=com",
    /**
     * Group Search Filter
     *
     * The Group Search Filter used to determine whether a user is authorized to access Polarity. The {{dn}} part of
     * the pattern will be replaced by the distinguised name (DN) of the user. The distinguished name attribute on the
     * user object is set by the option Group User DN Attribute found below.
     */
    groupSearchFilter: "(&(objectClass=group)(|(cn=Polarity-Admins)(cn=Polarity-Users))(member={{dn}}))",
    /**
     * Group Name Attribute
     */
    groupNameAttribute: "cn",
    /**
     * Group User DN Attribute
     *
     * The distingushed name attribute of the LDAP user object. The value of this attribute will be used to replace
     * the {{dn}} string in the Group Search Filter.
     */
    groupDnProperty: "distinguishedName",
    /**
     * The LDAP attribute that should be used as the "Email" property for the local Polarity account that is
     * created based on the LDAP user account. Please note that this attribute is case sensitive.
     */
    userEmailAttribute: 'mail',
    /**
     * The LDAP attribute that should be used as the Full Name property for the local Polarity account that is
     * created based on the LDAP user account. Please note that this attribute is case sensitive.
     */
    userDisplayNameAttribute: 'cn',
    tlsOptions: {
        /**
         * Set to false if testing against an LDAPS server with an invalid/untrusted certificate
         */
        rejectUnauthorized: true,
        secureProtocol: 'TLSv1_2_method'
    }
};
