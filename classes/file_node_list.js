const { Struct } = require('structjs');

class file_node_list {
    static get sizeof() { return 56; }
    static get name() { return 'file_node_list'; }

    node_type;
    node_id;
    attach_param_count;
    node_flags;
    #unk1;
    name;
    #unk2;
    node_body_off;
    #exb_func_count;
    #exb_io_field_size;
    multi_param_count;
    #unk3;
    base_attach_param_index;
    base_precondition_node;
    precondition_node_count;
    section_entry_addr;
    #unk4;
    guid;

    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        fromObj['node_type'] = Struct.readValue(data, position + 0, 'u16', isLittleEndian, undefined).value;
        fromObj['node_id'] = Struct.readValue(data, position + 2, 'u16', isLittleEndian, undefined).value;
        fromObj['attach_param_count'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['node_flags'] = Struct.readValue(data, position + 6, 'Bitfield8', isLittleEndian, {"#padding": 5, "isResidentNode": 1, "isModule": 1, "isPreconditionNode": 1}).value;
        fromObj['#unk1'] = Struct.readValue(data, position + 7, 'u8', isLittleEndian, undefined).value;
        fromObj['name'] = str_pool.readAt(Struct.readValue(data, position + 8, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['#unk2'] = Struct.readValue(data, position + 12, 'u32', isLittleEndian, undefined).value;
        fromObj['node_body_off'] = Struct.readValue(data, position + 16, 'u32', isLittleEndian, undefined).value;
        fromObj['#exb_func_count'] = Struct.readValue(data, position + 20, 'u16', isLittleEndian, undefined).value;
        fromObj['#exb_io_field_size'] = Struct.readValue(data, position + 22, 'u16', isLittleEndian, undefined).value;
        fromObj['multi_param_count'] = Struct.readValue(data, position + 24, 'u16', isLittleEndian, undefined).value;
        fromObj['#unk3'] = Struct.readValue(data, position + 26, 'u16', isLittleEndian, undefined).value;
        fromObj['base_attach_param_index'] = Struct.readValue(data, position + 28, 'u32', isLittleEndian, undefined).value;
        fromObj['base_precondition_node'] = Struct.readValue(data, position + 32, 'u16', isLittleEndian, undefined).value;
        fromObj['precondition_node_count'] = Struct.readValue(data, position + 34, 'u16', isLittleEndian, undefined).value;
        fromObj['section_entry_addr'] = Struct.readValue(data, position + 36, 'u16', isLittleEndian, undefined).value;
        fromObj['#unk4'] = Struct.readValue(data, position + 38, 'u16', isLittleEndian, undefined).value;
        fromObj['guid'] = Struct.readValue(data, position + 40, 'glob_uniq_id', isLittleEndian, undefined).value;

        return new file_node_list({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.node_type = options.fromObj['node_type'];
            this.node_id = options.fromObj['node_id'];
            this.attach_param_count = options.fromObj['attach_param_count'];
            this.node_flags = options.fromObj['node_flags'];
            this.#unk1 = options.fromObj['#unk1'];
            this.name = options.fromObj['name'];
            this.#unk2 = options.fromObj['#unk2'];
            this.node_body_off = options.fromObj['node_body_off'];
            this.#exb_func_count = options.fromObj['#exb_func_count'];
            this.#exb_io_field_size = options.fromObj['#exb_io_field_size'];
            this.multi_param_count = options.fromObj['multi_param_count'];
            this.#unk3 = options.fromObj['#unk3'];
            this.base_attach_param_index = options.fromObj['base_attach_param_index'];
            this.base_precondition_node = options.fromObj['base_precondition_node'];
            this.precondition_node_count = options.fromObj['precondition_node_count'];
            this.section_entry_addr = options.fromObj['section_entry_addr'];
            this.#unk4 = options.fromObj['#unk4'];
            this.guid = options.fromObj['guid'];
        }
    }

    static {
        Struct.registerFromClass(file_node_list);
    }
}

module.exports = file_node_list;