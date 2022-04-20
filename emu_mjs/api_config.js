var fs=require('fs');
var _ = require('lodash');

var cfgstr=fs.readFileSync('./conf0.json');
var cfg=JSON.parse(cfgstr);
exports.set=function(cfn)
{
     for (var key in cfn) { cfg[key] = cfn[key]; }
 }

exports.get=function(loc)
{
    var val = _.get(cfg, loc);
    if(val===undefined)
    val=""
    return JSON.stringify(val);
}

exports.BASE_PORT=5000;
exports.MAX_NODES=5;
exports.DEVICE_NO=0;