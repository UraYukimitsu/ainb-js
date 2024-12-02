const { Struct } = require('structjs');

class input_param {
    static get sizeof() { return 12; }
    static get name() { return 'input_param'; }

    name;
    input_child_index;
    io_source_index;
    flags;

    static read(data, position, isLittleEndian, options) {
        let fromObj = new Object;
        fromObj['name'] = options.str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['input_child_index'] = Struct.readValue(data, position + 4, 's16', isLittleEndian, undefined).value;
        fromObj['io_source_index'] = Struct.readValue(data, position + 6, 's16', isLittleEndian, undefined).value;
        fromObj['flags'] = Struct.readValue(data, position + 8, 'u32', isLittleEndian, undefined).value;

        return new input_param({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.input_child_index = options.fromObj['input_child_index'];
            this.io_source_index = options.fromObj['io_source_index'];
            this.flags = options.fromObj['flags'];
        }
    }

    static {
        Struct.registerFromClass(input_param);
    }
}

module.exports = input_param;