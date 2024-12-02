const { Struct } = require('structjs');

class global_param_entry {
    static get sizeof() { return 8; }
    static get name() { return 'global_param_entry'; }

    name_off_and_flag;
    string_off;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['name_off_and_flag'] = Struct.readValue(data, position + 0, 'Bitfield32', isLittleEndian, {"flag":10,"name_off":22}).value;
        fromObj['string_off'] = Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value;

        return new global_param_entry({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name_off_and_flag = options.fromObj['name_off_and_flag'];
            this.string_off = options.fromObj['string_off'];
        }
    }

    static {
        Struct.registerFromClass(global_param_entry);
    }
}

module.exports = global_param_entry;