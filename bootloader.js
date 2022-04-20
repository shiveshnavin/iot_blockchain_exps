
function load(path) {
    try {
        return require('./' + path)
    }
    catch (e) {
        return require('./emu_mjs/' + path)
    }
}
function gc() {
    console.log("No need of GC. You are running ESP on PC. Remember your powers.")
}
let print = function () {

    let str = '';
    for (let i = 0; i < arguments.length; i++) {
        try {
            str += ' ' + arguments[i];
            process.stdout.write(arguments[i]);
        }
        catch (err) {
            console.log(arguments[i])
        }
    }
    process.stdout.write('\n');
    if (UART !== undefined) {
        UART.write(str)
    }

}


module.exports = function () {
    this.gc = gc;
    this.load = load;
    this.print = print;
    this.Sys = load('api_sys.js');
    this.HTTP = load('api_http.js');
    this.RPC = load('api_rpc.js');
    this.Cfg = load('api_config.js');
    this.ffi = load('api_ffi.js');
    this.Event = load('api_events.js');
    this.Net = load('api_net.js');
    this.File = load('api_file.js');
    this.GPIO = ffi('gpio')
    this.Timer = load('api_timer.js');
    this.UART = load('api_uart.js');
}
