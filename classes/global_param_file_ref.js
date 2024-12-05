const { Struct } = require('structjs');

class global_param_file_ref {
    static get sizeof() { return 16; }
    static get name() { return 'global_param_file_ref'; }

    filename;
    name_hash;
    filename_hash;
    extension_hash;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        fromObj['filename'] = str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['name_hash'] = Struct.readValue(data, position + 4, 'u32', isLittleEndian, undefined).value;
        fromObj['filename_hash'] = Struct.readValue(data, position + 8, 'u32', isLittleEndian, undefined).value;
        fromObj['extension_hash'] = Struct.readValue(data, position + 12, 'u32', isLittleEndian, undefined).value;

        return new global_param_file_ref({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.filename = options.fromObj['filename'];
            this.name_hash = options.fromObj['name_hash'];
            this.filename_hash = options.fromObj['filename_hash'];
            this.extension_hash = options.fromObj['extension_hash'];
        }
    }

    static {
        Struct.registerFromClass(global_param_file_ref);
    }
}

module.exports = global_param_file_ref;