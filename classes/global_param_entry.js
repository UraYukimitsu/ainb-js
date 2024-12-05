const { Struct, Bitfield8 } = require('structjs');

class global_param_entry {
    static get sizeof() { return 8; }
    static get name() { return 'global_param_entry'; }

    name;
    flag;
    notes;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        let name_off_and_flag = Struct.readValue(data, position + 0, 'Bitfield32', isLittleEndian, {"validIndex": 1, "index": 7, "noFileRef": 1, "#unk1": 1, "name_off":22}).value;
        fromObj['name'] = str_pool.readAt(name_off_and_flag.name_off, 'string');
        fromObj['flag'] = new Bitfield8(0, {"validIndex": 1, "index": 7});
        fromObj['flag'].validIndex = name_off_and_flag.validIndex;
        fromObj['flag'].index = name_off_and_flag.index;
        fromObj['notes'] = str_pool.readAt(Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value, 'string');

        return new global_param_entry({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.flag = options.fromObj['flag'];
            this.notes = options.fromObj['notes'];
        }
    }

    static {
        Struct.registerFromClass(global_param_entry);
    }
}

module.exports = global_param_entry;