const { Struct } = require('structjs');

class global_param_section_header {
    static get sizeof() { return 8; }
    static get name() { return 'global_param_section_header'; }

    entry_count;
    first_param_index;
    first_param_rel_off;
    #unk1;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['entry_count'] = Struct.readValue(data, position + 0, 'u16', isLittleEndian, undefined).value;
        fromObj['first_param_index'] = Struct.readValue(data, position + 2, 'u16', isLittleEndian, undefined).value;
        fromObj['first_param_rel_off'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['#unk1'] = Struct.readValue(data, position + 6, 'u16', isLittleEndian, undefined).value;

        return new global_param_section_header({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.entry_count = options.fromObj['entry_count'];
            this.first_param_index = options.fromObj['first_param_index'];
            this.first_param_rel_off = options.fromObj['first_param_rel_off'];
            this.#unk1 = options.fromObj['#unk1'];
        }
    }

    static {
        Struct.registerFromClass(global_param_section_header);
    }
}

module.exports = global_param_section_header;