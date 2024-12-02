const { Struct } = require('structjs');

class ainb_header {
    static get sizeof() { return 116; }
    static get name() { return 'ainb_header'; }

    magic;
    version;
    filename_off;
    command_count;
    node_count;
    precondition_node_count;
    attach_param_count;
    out_node_count;
    global_param_off;
    str_pool_off;
    resolve_array_off;
    imm_param_off;
    resident_update_array_off;
    io_param_off;
    multi_param_off;
    attach_param_off;
    attach_param_index_list_off;
    exb_section_off;
    child_replacement_table_off;
    precondition_node_array_off;
    #unk1;
    #unk2;
    #unk3;
    embedded_ainb_off;
    file_category_name_off;
    file_category;
    entry_str_off;
    #unk4;
    file_ident_hash_off;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['magic'] = new Array;
        fromObj['magic'].push(Struct.readValue(data, position + 0, 'char', isLittleEndian).value);
        fromObj['magic'].push(Struct.readValue(data, position + 1, 'char', isLittleEndian).value);
        fromObj['magic'].push(Struct.readValue(data, position + 2, 'char', isLittleEndian).value);
        fromObj['magic'].push(Struct.readValue(data, position + 3, 'char', isLittleEndian).value);
        fromObj['version'] = Struct.readValue(data, position + 4, 'u32', isLittleEndian).value;
        fromObj['filename_off'] = Struct.readValue(data, position + 8, 'u32', isLittleEndian).value;
        fromObj['command_count'] = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;
        fromObj['node_count'] = Struct.readValue(data, position + 16, 'u32', isLittleEndian).value;
        fromObj['precondition_node_count'] = Struct.readValue(data, position + 20, 'u32', isLittleEndian).value;
        fromObj['attach_param_count'] = Struct.readValue(data, position + 24, 'u32', isLittleEndian).value;
        fromObj['out_node_count'] = Struct.readValue(data, position + 28, 'u32', isLittleEndian).value;
        fromObj['global_param_off'] = Struct.readValue(data, position + 32, 'u32', isLittleEndian).value;
        fromObj['str_pool_off'] = Struct.readValue(data, position + 36, 'u32', isLittleEndian).value;
        fromObj['resolve_array_off'] = Struct.readValue(data, position + 40, 'u32', isLittleEndian).value;
        fromObj['imm_param_off'] = Struct.readValue(data, position + 44, 'u32', isLittleEndian).value;
        fromObj['resident_update_array_off'] = Struct.readValue(data, position + 48, 'u32', isLittleEndian).value;
        fromObj['io_param_off'] = Struct.readValue(data, position + 52, 'u32', isLittleEndian).value;
        fromObj['multi_param_off'] = Struct.readValue(data, position + 56, 'u32', isLittleEndian).value;
        fromObj['attach_param_off'] = Struct.readValue(data, position + 60, 'u32', isLittleEndian).value;
        fromObj['attach_param_index_list_off'] = Struct.readValue(data, position + 64, 'u32', isLittleEndian).value;
        fromObj['exb_section_off'] = Struct.readValue(data, position + 68, 'u32', isLittleEndian).value;
        fromObj['child_replacement_table_off'] = Struct.readValue(data, position + 72, 'u32', isLittleEndian).value;
        fromObj['precondition_node_array_off'] = Struct.readValue(data, position + 76, 'u32', isLittleEndian).value;
        fromObj['#unk1'] = Struct.readValue(data, position + 80, 'u32', isLittleEndian).value;
        fromObj['#unk2'] = Struct.readValue(data, position + 84, 'u32', isLittleEndian).value;
        fromObj['#unk3'] = Struct.readValue(data, position + 88, 'u32', isLittleEndian).value;
        fromObj['embedded_ainb_off'] = Struct.readValue(data, position + 92, 'u32', isLittleEndian).value;
        fromObj['file_category_name_off'] = Struct.readValue(data, position + 96, 'u32', isLittleEndian).value;
        fromObj['file_category'] = Struct.readValue(data, position + 100, 'u32', isLittleEndian).value;
        fromObj['entry_str_off'] = Struct.readValue(data, position + 104, 'u32', isLittleEndian).value;
        fromObj['#unk4'] = Struct.readValue(data, position + 108, 'u32', isLittleEndian).value;
        fromObj['file_ident_hash_off'] = Struct.readValue(data, position + 112, 'u32', isLittleEndian).value;

        return new ainb_header({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.magic = options.fromObj['magic'];
            this.version = options.fromObj['version'];
            this.filename_off = options.fromObj['filename_off'];
            this.command_count = options.fromObj['command_count'];
            this.node_count = options.fromObj['node_count'];
            this.precondition_node_count = options.fromObj['precondition_node_count'];
            this.attach_param_count = options.fromObj['attach_param_count'];
            this.out_node_count = options.fromObj['out_node_count'];
            this.global_param_off = options.fromObj['global_param_off'];
            this.str_pool_off = options.fromObj['str_pool_off'];
            this.resolve_array_off = options.fromObj['resolve_array_off'];
            this.imm_param_off = options.fromObj['imm_param_off'];
            this.resident_update_array_off = options.fromObj['resident_update_array_off'];
            this.io_param_off = options.fromObj['io_param_off'];
            this.multi_param_off = options.fromObj['multi_param_off'];
            this.attach_param_off = options.fromObj['attach_param_off'];
            this.attach_param_index_list_off = options.fromObj['attach_param_index_list_off'];
            this.exb_section_off = options.fromObj['exb_section_off'];
            this.child_replacement_table_off = options.fromObj['child_replacement_table_off'];
            this.precondition_node_array_off = options.fromObj['precondition_node_array_off'];
            this.#unk1 = options.fromObj['#unk1'];
            this.#unk2 = options.fromObj['#unk2'];
            this.#unk3 = options.fromObj['#unk3'];
            this.embedded_ainb_off = options.fromObj['embedded_ainb_off'];
            this.file_category_name_off = options.fromObj['file_category_name_off'];
            this.file_category = options.fromObj['file_category'];
            this.entry_str_off = options.fromObj['entry_str_off'];
            this.#unk4 = options.fromObj['#unk4'];
            this.file_ident_hash_off = options.fromObj['file_ident_hash_off'];
        }

        if (this.magic.join('') !== 'AIB ') 
            throw new Error(`Invalid magic '${this.magic.join('')}' - expected 'AIB '.`)
        
        if ([0x0404, 0x0407].indexOf(this.version) < 0) 
            throw new Error(`Invalid version 0x${this.version.toString(16)} - expected 0x0404 or 0x0407.`);
    }

    static {
        Struct.registerFromClass(ainb_header);
    }
}

module.exports = ainb_header;