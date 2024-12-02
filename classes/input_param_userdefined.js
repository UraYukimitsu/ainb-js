const { Struct } = require('structjs');

class input_param_userdefined {
    static get sizeof() { return 20; }
    static get name() { return 'input_param_userdefined'; }

    name_off;
    class_name_off;
    input_child_index;
    io_source_index;
    flags;
    default_value;

    static read(data, position, isLittleEndian) {
        let name_off = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let class_name_off = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let input_child_index = Struct.readValue(data, position + 8, 's16', isLittleEndian).value;
        let io_source_index = Struct.readValue(data, position + 10, 's16', isLittleEndian).value;
        let flags = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;
        let default_value = Struct.readValue(data, position + 16, 'u32', isLittleEndian).value;

        return new input_param_userdefined(name_off, class_name_off, input_child_index, io_source_index, flags, default_value);
    }

    constructor(name_off, class_name_off, input_child_index, io_source_index, flags, default_value) {
        this.name_off = name_off;
        this.class_name_off = class_name_off;
        this.input_child_index = input_child_index;
        this.io_source_index = io_source_index;
        this.flags = flags;
        this.default_value = default_value;
    }

    static {
        Struct.registerFromClass(input_param_userdefined);
    }
}

module.exports = input_param_userdefined;