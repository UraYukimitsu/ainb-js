const { Struct } = require('structjs');

class imm_param_header {
    static get sizeof() { return 24; }
    static get name() { return 'imm_param_header'; }

    u32_off;
    bool_off;
    float_off;
    string_off;
    vec3f_off;
    userdefined_off;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['u32_off'] = Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value;
        fromObj['bool_off'] = Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value;
        fromObj['float_off'] = Struct.readValue(data, position + 8, 'u32', isLittleEndian, undefined).value;
        fromObj['string_off'] = Struct.readValue(data, position + 12, 'u32', isLittleEndian, undefined).value;
        fromObj['vec3f_off'] = Struct.readValue(data, position + 16, 'u32', isLittleEndian, undefined).value;
        fromObj['userdefined_off'] = Struct.readValue(data, position + 20, 'u32', isLittleEndian, undefined).value;

        return new imm_param_header({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.u32_off = options.fromObj['u32_off'];
            this.bool_off = options.fromObj['bool_off'];
            this.float_off = options.fromObj['float_off'];
            this.string_off = options.fromObj['string_off'];
            this.vec3f_off = options.fromObj['vec3f_off'];
            this.userdefined_off = options.fromObj['userdefined_off'];
        }
    }

    static {
        Struct.registerFromClass(imm_param_header);
    }
}

module.exports = imm_param_header;