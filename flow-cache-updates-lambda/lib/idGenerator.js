const uuid = require('uuid/v4');

module.exports = {
    randomId: function(prefix) {
        const u = uuid();
        return `${prefix}-${u.replace(/-/g, '')}`;
    }
}