const { Struct } = require('structjs');

class attach_param_entry {
    static get sizeof() { return 12; }
    static get name() { return 'attach_param_entry'; }

    name_off;
    sub_param_entry_off;
    exb_func_count;
    exb_io_field_size;

    static read(data, position, isLittleEndian) {
        let name_off = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let sub_param_entry_off = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let exb_func_count = Struct.readValue(data, position + 8, 'u16', isLittleEndian).value;
        let exb_io_field_size = Struct.readValue(data, position + 10, 'u16', isLittleEndian).value;

        return new attach_param_entry(name_off, sub_param_entry_off, exb_func_count, exb_io_field_size);
    }

    constructor(name_off, sub_param_entry_off, exb_func_count, exb_io_field_size) {
        this.name_off = name_off;
        this.sub_param_entry_off = sub_param_entry_off;
        this.exb_func_count = exb_func_count;
        this.exb_io_field_size = exb_io_field_size;
    }

    static {
        Struct.registerFromClass(attach_param_entry);
    }
}

module.exports = attach_param_entry;