var fs = require('fs');
var _ = require('lodash');

var config0Data = fs.readFileSync(__dirname +'/conf0.json');

if (fs.existsSync('./conf9.json')) {
    config0Data = fs.readFileSync('./conf9.json');
}

var cfg = JSON.parse(config0Data);

exports.set = function (cfn) {
    for (var key in cfn) { cfg[key] = cfn[key]; }
}

exports.get = function (loc) {
    var val = _.get(cfg, loc);
    if (val === undefined)
        val = ""
    return JSON.stringify(val);
}

exports.BASE_PORT = 5000;
exports.MAX_NODES = 5;
exports.DEVICE_NO = 0;