const { Struct } = require('structjs');

class multi_param {
    static get sizeof() { return 8; }
    static get name() { return 'multi_param'; }

    node_index;
    param_index;
    index;
    flags;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['node_index'] = Struct.readValue(data, position + 0, 'u16', isLittleEndian, undefined).value;
        fromObj['param_index'] = Struct.readValue(data, position + 2, 'u16', isLittleEndian, undefined).value;
        fromObj['index'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['flags'] = Struct.readValue(data, position + 6, 'u16', isLittleEndian, undefined).value;

        return new multi_param({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.node_index = options.fromObj['node_index'];
            this.param_index = options.fromObj['param_index'];
            this.index = options.fromObj['index'];
            this.flags = options.fromObj['flags'];
        }
    }

    static {
        Struct.registerFromClass(multi_param);
    }
}

module.exports = multi_param;