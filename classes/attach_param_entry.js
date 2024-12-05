const { Struct } = require('structjs');

class attach_param_entry {
    static get sizeof() { return 12; }
    static get name() { return 'attach_param_entry'; }

    name;
    sub_param_entry_off;
    exb_func_count;
    exb_io_field_size;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        fromObj['name'] = str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['sub_param_entry_off'] = Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value;
        fromObj['exb_func_count'] = Struct.readValue(data, position + 8, 'u16', isLittleEndian, undefined).value;
        fromObj['exb_io_field_size'] = Struct.readValue(data, position + 10, 'u16', isLittleEndian, undefined).value;

        return new attach_param_entry({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.sub_param_entry_off = options.fromObj['sub_param_entry_off'];
            this.exb_func_count = options.fromObj['exb_func_count'];
            this.exb_io_field_size = options.fromObj['exb_io_field_size'];
        }
    }

    static {
        Struct.registerFromClass(attach_param_entry);
    }
}

module.exports = attach_param_entry;