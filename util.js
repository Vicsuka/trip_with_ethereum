const fs = require("fs");

module.exports = {
  invokeJsonData: function () {
    var users;
    this.readJSONFile("data/users.json", function (err, json) {
      if (err) {
        throw err;
      }
      users = json;
    });
    return users;
  },

  readJSONFile: function (filename, callback) {
    fs.readFile(filename, function (err, data) {
      if (err) {
        callback(err);
        return;
      }
      try {
        callback(null, JSON.parse(data));
      } catch (exception) {
        callback(exception);
      }
    });
  },
};
