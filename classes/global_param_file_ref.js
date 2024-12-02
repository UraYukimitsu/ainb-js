const { Struct } = require('structjs');

class global_param_file_ref {
    static get sizeof() { return 16; }
    static get name() { return 'global_param_file_ref'; }

    name_off;
    name_hash;
    filename_hash;
    extension_hash;

    static read(data, position, isLittleEndian) {
        let name_off = Struct.readValue(data, position + 0, 'u32', isLittleEndian).value;
        let name_hash = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        let filename_hash = Struct.readValue(data, position + 8, 'u32', isLittleEndian).value;
        let extension_hash = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;

        return new global_param_file_ref(name_off, name_hash, filename_hash, extension_hash);
    }

    constructor(name_off, name_hash, filename_hash, extension_hash) {
        this.name_off = name_off;
        this.name_hash = name_hash;
        this.filename_hash = filename_hash;
        this.extension_hash = extension_hash;
    }

    static {
        Struct.registerFromClass(global_param_file_ref);
    }
}

module.exports = global_param_file_ref;