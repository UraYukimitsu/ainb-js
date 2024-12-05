const { Struct } = require('structjs');

class input_param_userdefined {
    static get sizeof() { return 20; }
    static get name() { return 'input_param_userdefined'; }

    name;
    class_name;
    input_child_index;
    io_source_index;
    flags;
    default_value;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        fromObj['name'] = str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['class_name'] = str_pool.readAt(Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['input_child_index'] = Struct.readValue(data, position + 8, 's16', isLittleEndian, undefined).value;
        fromObj['io_source_index'] = Struct.readValue(data, position + 10, 's16', isLittleEndian, undefined).value;
        fromObj['flags'] = Struct.readValue(data, position + 12, 'u32', isLittleEndian, undefined).value;
        fromObj['default_value'] = Struct.readValue(data, position + 16, 'u32', isLittleEndian, undefined).value;

        return new input_param_userdefined({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.class_name = options.fromObj['class_name'];
            this.input_child_index = options.fromObj['input_child_index'];
            this.io_source_index = options.fromObj['io_source_index'];
            this.flags = options.fromObj['flags'];
            this.default_value = options.fromObj['default_value'];
        }

        if (this.input_child_index <= -100 && this.input_child_index >= -8192) {
            this.multi_index = -100 - this.input_child_index;
            this.multi_count = this.io_source_index;
        }
    }

    static {
        Struct.registerFromClass(input_param_userdefined);
    }
}

module.exports = input_param_userdefined;