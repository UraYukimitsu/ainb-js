const { Struct } = require('structjs');

class multi_param {
    static get sizeof() { return 8; }
    static get name() { return 'multi_param'; }

    node_index;
    param_index;
    index;
    flags;

    static read(data, position, isLittleEndian) {
        let node_index = Struct.readValue(data, position + 0, 'u16', isLittleEndian).value;
        let param_index = Struct.readValue(data, position + 2, 'u16', isLittleEndian).value;
        let index = Struct.readValue(data, position + 4, 'u16', isLittleEndian).value;
        let flags = Struct.readValue(data, position + 6, 'u16', isLittleEndian).value;

        return new multi_param(node_index, param_index, index, flags);
    }

    constructor(node_index, param_index, index, flags) {
        this.node_index = node_index;
        this.param_index = param_index;
        this.index = index;
        this.flags = flags;
    }

    static {
        Struct.registerFromClass(multi_param);
    }
}

module.exports = multi_param;