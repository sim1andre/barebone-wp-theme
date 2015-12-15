var path = require('path');

module.exports = function getThemeName() {
  var tn= path.resolve(path.join(__dirname, '../../'));
  return path.basename(tn);
}
