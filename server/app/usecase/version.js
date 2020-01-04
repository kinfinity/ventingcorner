/**
 * Version usecase is a business logic of version
 */
const VersionDomain = require('../domains/version');

class Version {

  // Display method show the current version number of this application
    static display() {

    return VersionDomain.toString();

  }

    static toString() {

    return 'Version use case';

  }

}

module.exports = Version;