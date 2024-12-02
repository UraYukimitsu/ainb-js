const { Struct } = require('structjs');

class attach_sub_param {
    static get sizeof() { return 100; }
    static get name() { return 'attach_sub_param'; }

    #unk1_debug;
    int_param_base_index;
    int_param_count;
    bool_param_base_index;
    bool_param_count;
    float_param_base_index;
    float_param_count;
    string_param_base_index;
    string_param_count;
    vec3f_param_base_index;
    vec3f_param_count;
    user_defined_param_base_index;
    user_defined_param_count;
    #unk2;
    #unk3_next_entry_addr;
    #unk4;
    #unk5_next_entry_addr;
    #unk6;
    #unk7_next_entry_addr;
    #unk8;
    #unk9_next_entry_addr;
    #unk10;
    #unk11_next_entry_addr;
    #unk12;
    #unk13_next_entry_addr;

    static read(data, position, isLittleEndian) {
        let p_unk1_debug = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let int_param_base_index = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let int_param_count = Struct.readValue(data, position + 8, 'u32', isLittleEndian).value;
        let bool_param_base_index = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;
        let bool_param_count = Struct.readValue(data, position + 16, 'u32', isLittleEndian).value;
        let float_param_base_index = Struct.readValue(data, position + 20, 'u32', isLittleEndian).value;
        let float_param_count = Struct.readValue(data, position + 24, 'u32', isLittleEndian).value;
        let string_param_base_index = Struct.readValue(data, position + 28, 'u32', isLittleEndian).value;
        let string_param_count = Struct.readValue(data, position + 32, 'u32', isLittleEndian).value;
        let vec3f_param_base_index = Struct.readValue(data, position + 36, 'u32', isLittleEndian).value;
        let vec3f_param_count = Struct.readValue(data, position + 40, 'u32', isLittleEndian).value;
        let user_defined_param_base_index = Struct.readValue(data, position + 44, 'u32', isLittleEndian).value;
        let user_defined_param_count = Struct.readValue(data, position + 48, 'u32', isLittleEndian).value;
        let p_unk2 = Struct.readValue(data, position + 52, 'u32', isLittleEndian).value;
        let p_unk3_next_entry_addr = Struct.readValue(data, position + 56, 'u32', isLittleEndian).value;
        let p_unk4 = Struct.readValue(data, position + 60, 'u32', isLittleEndian).value;
        let p_unk5_next_entry_addr = Struct.readValue(data, position + 64, 'u32', isLittleEndian).value;
        let p_unk6 = Struct.readValue(data, position + 68, 'u32', isLittleEndian).value;
        let p_unk7_next_entry_addr = Struct.readValue(data, position + 72, 'u32', isLittleEndian).value;
        let p_unk8 = Struct.readValue(data, position + 76, 'u32', isLittleEndian).value;
        let p_unk9_next_entry_addr = Struct.readValue(data, position + 80, 'u32', isLittleEndian).value;
        let p_unk10 = Struct.readValue(data, position + 84, 'u32', isLittleEndian).value;
        let p_unk11_next_entry_addr = Struct.readValue(data, position + 88, 'u32', isLittleEndian).value;
        let p_unk12 = Struct.readValue(data, position + 92, 'u32', isLittleEndian).value;
        let p_unk13_next_entry_addr = Struct.readValue(data, position + 96, 'u32', isLittleEndian).value;

        return new attach_sub_param(p_unk1_debug, int_param_base_index, int_param_count, bool_param_base_index, bool_param_count, float_param_base_index, float_param_count, string_param_base_index, string_param_count, vec3f_param_base_index, vec3f_param_count, user_defined_param_base_index, user_defined_param_count, p_unk2, p_unk3_next_entry_addr, p_unk4, p_unk5_next_entry_addr, p_unk6, p_unk7_next_entry_addr, p_unk8, p_unk9_next_entry_addr, p_unk10, p_unk11_next_entry_addr, p_unk12, p_unk13_next_entry_addr);
    }

    constructor(p_unk1_debug, int_param_base_index, int_param_count, bool_param_base_index, bool_param_count, float_param_base_index, float_param_count, string_param_base_index, string_param_count, vec3f_param_base_index, vec3f_param_count, user_defined_param_base_index, user_defined_param_count, p_unk2, p_unk3_next_entry_addr, p_unk4, p_unk5_next_entry_addr, p_unk6, p_unk7_next_entry_addr, p_unk8, p_unk9_next_entry_addr, p_unk10, p_unk11_next_entry_addr, p_unk12, p_unk13_next_entry_addr) {
        this.#unk1_debug = p_unk1_debug;
        this.int_param_base_index = int_param_base_index;
        this.int_param_count = int_param_count;
        this.bool_param_base_index = bool_param_base_index;
        this.bool_param_count = bool_param_count;
        this.float_param_base_index = float_param_base_index;
        this.float_param_count = float_param_count;
        this.string_param_base_index = string_param_base_index;
        this.string_param_count = string_param_count;
        this.vec3f_param_base_index = vec3f_param_base_index;
        this.vec3f_param_count = vec3f_param_count;
        this.user_defined_param_base_index = user_defined_param_base_index;
        this.user_defined_param_count = user_defined_param_count;
        this.#unk2 = p_unk2;
        this.#unk3_next_entry_addr = p_unk3_next_entry_addr;
        this.#unk4 = p_unk4;
        this.#unk5_next_entry_addr = p_unk5_next_entry_addr;
        this.#unk6 = p_unk6;
        this.#unk7_next_entry_addr = p_unk7_next_entry_addr;
        this.#unk8 = p_unk8;
        this.#unk9_next_entry_addr = p_unk9_next_entry_addr;
        this.#unk10 = p_unk10;
        this.#unk11_next_entry_addr = p_unk11_next_entry_addr;
        this.#unk12 = p_unk12;
        this.#unk13_next_entry_addr = p_unk13_next_entry_addr;
    }

    static {
        Struct.registerFromClass(attach_sub_param);
    }
}

module.exports = attach_sub_param;