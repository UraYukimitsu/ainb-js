const { Struct } = require('structjs');

class file_node_list {
    static get sizeof() { return 56; }
    static get name() { return 'file_node_list'; }

    node_type;
    node_id;
    attach_param_count;
    node_flags;
    #unk1;
    name_off;
    #unk2;
    node_body_off;
    exb_func_count;
    exb_io_field_size;
    multi_param_count;
    #unk3;
    base_attach_param_index;
    base_precondition_node;
    precondition_node_count;
    section_entry_addr;
    #unk4;
    guid;

    static read(data, position, isLittleEndian) {
        let node_type = Struct.readValue(data, position + 0, 'u16', isLittleEndian).value;
        let node_id = Struct.readValue(data, position + 2, 'u16', isLittleEndian).value;
        let attach_param_count = Struct.readValue(data, position + 4, 'u16', isLittleEndian).value;
        let node_flags = Struct.readValue(data, position + 6, 'u8', isLittleEndian).value;
        let p_unk1 = Struct.readValue(data, position + 7, 'u8', isLittleEndian).value;
        let name_off = Struct.readValue(data, position + 8, 'u32', isLittleEndian).value;
        let p_unk2 = Struct.readValue(data, position + 12, 'u32', isLittleEndian).value;
        let node_body_off = Struct.readValue(data, position + 16, 'u32', isLittleEndian).value;
        let exb_func_count = Struct.readValue(data, position + 20, 'u16', isLittleEndian).value;
        let exb_io_field_size = Struct.readValue(data, position + 22, 'u16', isLittleEndian).value;
        let multi_param_count = Struct.readValue(data, position + 24, 'u16', isLittleEndian).value;
        let p_unk3 = Struct.readValue(data, position + 26, 'u16', isLittleEndian).value;
        let base_attach_param_index = Struct.readValue(data, position + 28, 'u32', isLittleEndian).value;
        let base_precondition_node = Struct.readValue(data, position + 32, 'u16', isLittleEndian).value;
        let precondition_node_count = Struct.readValue(data, position + 34, 'u16', isLittleEndian).value;
        let section_entry_addr = Struct.readValue(data, position + 36, 'u16', isLittleEndian).value;
        let p_unk4 = Struct.readValue(data, position + 38, 'u16', isLittleEndian).value;
        let guid = Struct.readValue(data, position + 40, 'glob_uniq_id', isLittleEndian).value;

        return new file_node_list(node_type, node_id, attach_param_count, node_flags, p_unk1, name_off, p_unk2, node_body_off, exb_func_count, exb_io_field_size, multi_param_count, p_unk3, base_attach_param_index, base_precondition_node, precondition_node_count, section_entry_addr, p_unk4, guid);
    }

    constructor(node_type, node_id, attach_param_count, node_flags, p_unk1, name_off, p_unk2, node_body_off, exb_func_count, exb_io_field_size, multi_param_count, p_unk3, base_attach_param_index, base_precondition_node, precondition_node_count, section_entry_addr, p_unk4, guid) {
        this.node_type = node_type;
        this.node_id = node_id;
        this.attach_param_count = attach_param_count;
        this.node_flags = node_flags;
        this.#unk1 = p_unk1;
        this.name_off = name_off;
        this.#unk2 = p_unk2;
        this.node_body_off = node_body_off;
        this.exb_func_count = exb_func_count;
        this.exb_io_field_size = exb_io_field_size;
        this.multi_param_count = multi_param_count;
        this.#unk3 = p_unk3;
        this.base_attach_param_index = base_attach_param_index;
        this.base_precondition_node = base_precondition_node;
        this.precondition_node_count = precondition_node_count;
        this.section_entry_addr = section_entry_addr;
        this.#unk4 = p_unk4;
        this.guid = guid;
    }

    static {
        Struct.registerFromClass(file_node_list);
    }
}

module.exports = file_node_list;