const { Struct } = require('structjs');

class attach_param_entry_0407 {
    static get sizeof() { return 16; }
    static get name() { return 'attach_param_entry_0407'; }

    name_off;
    param_entry_off;
    exb_func_count;
    exb_io_field_size;
    name_hash;

    static read(data, position, isLittleEndian) {
        let name_off = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let param_entry_off = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let exb_func_count = Struct.readValue(data, position + 8, 'u16', isLittleEndian).value;
        let exb_io_field_size = Struct.readValue(data, position + 10, 'u16', isLittleEndian).value;
        let name_hash = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;

        return new attach_param_entry_0407(name_off, param_entry_off, exb_func_count, exb_io_field_size, name_hash);
    }

    constructor(name_off, param_entry_off, exb_func_count, exb_io_field_size, name_hash) {
        this.name_off = name_off;
        this.param_entry_off = param_entry_off;
        this.exb_func_count = exb_func_count;
        this.exb_io_field_size = exb_io_field_size;
        this.name_hash = name_hash;
    }

    static {
        Struct.registerFromClass(attach_param_entry_0407);
    }
}

module.exports = attach_param_entry_0407;