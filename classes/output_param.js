const { Struct } = require('structjs');

class output_param {
    static get sizeof() { return 4; }
    static get name() { return 'output_param'; }

    isOutput;
    name;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        let flag_and_name_off = Struct.readValue(data, position + 0, 'Bitfield32', isLittleEndian, {"IsOutput":1,"#unk1":1,"name_off":30}).value;

        fromObj['isOutput'] = Boolean(flag_and_name_off.IsOutput);
        fromObj['name'] = str_pool.readAt(flag_and_name_off.name_off, 'string');

        return new output_param({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.isOutput = options.fromObj['isOutput'];
            this.name = options.fromObj['name'];
        }
    }

    static {
        Struct.registerFromClass(output_param);
    }
}

module.exports = output_param;