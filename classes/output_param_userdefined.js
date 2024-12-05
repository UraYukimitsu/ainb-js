const { Struct } = require('structjs');

class output_param_userdefined {
    static get sizeof() { return 8; }
    static get name() { return 'output_param_userdefined'; }

    isOutput;
    name;
    class_name;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        let flag_and_name_off = Struct.readValue(data, position + 0, 'Bitfield32', isLittleEndian, {"IsOutput":1,"#unk1":1,"name_off":30}).value;

        fromObj['isOutput'] = Boolean(flag_and_name_off.IsOutput);
        fromObj['name'] = str_pool.readAt(flag_and_name_off.name_off, 'string');
        fromObj['class_name'] = str_pool.readAt(Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value, 'string');

        return new output_param_userdefined({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.isOutput = options.fromObj['isOutput'];
            this.name = options.fromObj['name'];
            this.class_name = options.fromObj['class_name'];
        }
    }

    static {
        Struct.registerFromClass(output_param_userdefined);
    }
}

module.exports = output_param_userdefined;