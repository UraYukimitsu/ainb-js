const { Struct } = require('structjs');

class imm_param {
    static get sizeof() { return 8; }
    static get name() { return 'imm_param'; }

    name;
    index;
    flags;

    static read(data, position, isLittleEndian, options) {
        let fromObj = new Object;
        fromObj['name'] = options.str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['index'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['flags'] = Struct.readValue(data, position + 6, 'Bitfield16', isLittleEndian, {"Blackboard": 1, "#unk1": 1, "EXB": 4, "#unk2": 1, "IsOutput": 1, "PulseTLS": 1}).value;

        return new imm_param({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.index = options.fromObj['index'];
            this.flags = options.fromObj['flags'];
        }
    }

    static {
        Struct.registerFromClass(imm_param);
    }
}

module.exports = imm_param;