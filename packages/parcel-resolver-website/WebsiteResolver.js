const {Resolver} = require('@parcel/plugin');
const path = require('path');

module.exports = new Resolver({
  resolve({specifier, dependency, options}) {
    if (specifier.startsWith('/')) {
      return {
        filePath: path.join(options.projectRoot, '_site', specifier)
      };
    }
  }
});
