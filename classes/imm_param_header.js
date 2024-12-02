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
        let u32_off = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let bool_off = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let float_off = Struct.readValue(data, position + 8, 'u32', isLittleEndian).value;
        let string_off = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;
        let vec3f_off = Struct.readValue(data, position + 16, 'u32', isLittleEndian).value;
        let userdefined_off = Struct.readValue(data, position + 20, 'u32', isLittleEndian).value;

        return new imm_param_header(u32_off, bool_off, float_off, string_off, vec3f_off, userdefined_off);
    }

    constructor(u32_off, bool_off, float_off, string_off, vec3f_off, userdefined_off) {
        this.u32_off = u32_off;
        this.bool_off = bool_off;
        this.float_off = float_off;
        this.string_off = string_off;
        this.vec3f_off = vec3f_off;
        this.userdefined_off = userdefined_off;
    }

    static {
        Struct.registerFromClass(imm_param_header);
    }
}

module.exports = imm_param_header;