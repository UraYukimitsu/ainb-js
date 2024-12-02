const { DataViewStream } = require('structjs');

const globalParamTypes = ["string", "s32", "float", "bool", "vec3f", "userdefined"];
const standardTypes = ["s32", "bool", "float", "string", "vec3f", "userdefined"];

const glob_uniq_id = require('./classes/glob_uniq_id.js');
const vec3f = require('./classes/vec3f.js');
const ainb_header = require('./classes/ainb_header.js');
const commands_list = require('./classes/commands_list.js');
const file_node_list = require('./classes/file_node_list.js');
const global_param_section_header = require('./classes/global_param_section_header.js');
const global_param_file_ref = require('./classes/global_param_file_ref.js');
const imm_param_header = require('./classes/imm_param_header.js');
const imm_param = require('./classes/imm_param.js');
const imm_param_userdefined = require('./classes/imm_param_userdefined.js');
const attach_param_entry = require('./classes/attach_param_entry.js');
const attach_sub_param = require('./classes/attach_sub_param.js');
const input_param = require('./classes/input_param.js');
const input_param_userdefined = require('./classes/input_param_userdefined.js');
const multi_param = require('./classes/multi_param.js');

class AINB {
    #data;
    #str_pool;
    #max_global_index = 0;
    #command_end;
    /**
     * @type {ainb_header}
     */
    header;
    /**
     * @type {commands_list[]}
     */
    commands;
    global_header;
    global_params;
    global_refs;
    filename;
    category_name;
    exb;
    imm_params;
    attach_param;
    input_params;
    output_params;
    resident_update_array;
    precondition_nodes;
    entry_strings;
    embedded_ainb;
    file_hashes;
    nodes;
    
    constructor(buffer) {
        if (!ArrayBuffer.prototype.isPrototypeOf(buffer))
            throw new TypeError('Parameter buffer is not of type ArrayBuffer.');

        this.#data = new DataViewStream(buffer);
        let data = this.#data;
    
        this.header = data.readNext('ainb_header', true);

        this.#str_pool = new DataViewStream(buffer, this.header.str_pool_off);
        let str_pool = this.#str_pool;
        
        this.filename = str_pool.readAt(this.header.filename_off, 'string');
        this.category_name = str_pool.readAt(this.header.file_category_name_off, 'string');
    
        this.commands = new Array;
        for (let i = 0; i < this.header.command_count; i++) {
            this.commands.push(data.readNext('commands_list', true, {str_pool}));
        }
        this.#command_end = data.tell();
    
        data.seek(this.header.global_param_off);
        this.global_header = new Object;
        this.global_params = new Object;
        this.#readGlobalParams();

        this.exb = new Object;
        if (this.header.exb_section_off != 0) {
            throw new Error('EXB section not implemented yet.'); // unused in Splatoon 3?
        }

        this.#readImmediateParams();

        this.#readAttachParams();

        this.#readIOParams();

        this.#readResidentUpdateArray();

        this.#readPreconditionNodes();

        this.#readEntryStrings();

        this.#readEmbeddedAINB();

        this.#readFileHashes();

        this.#readNodes();
    }

    #readParam(type) {
        switch (type) {
            case 'string':
                let off = this.#data.readNext('u32', true);
                return this.#str_pool.readAt(off, 'string');
    
            case 's32':
            case 'float':
            case 'bool':
            case 'vec3f':
                return this.#data.readNext(type, true);

            case 'userdefined':
                return null;

            default:
                throw new Error(`Invalid type ${type}. This shouldn't happen.`);
        }
    }

    #readGlobalParams() {
        let data = this.#data;
        let str_pool = this.#str_pool;

        for (let t in globalParamTypes) {
            let hdr = data.readNext('global_param_section_header', true);
            this.global_header[globalParamTypes[t]] = hdr;
        }
    
        for (let t in this.global_header) {
            let params = new Array;
            for (let i  = 0; i < this.global_header[t].entry_count; i++) {
                let entry = new Object;
                let entryStruct = data.readNext('global_param_entry', true);
                let bitfield = entryStruct.name_off_and_flag;
                let name_off = bitfield & 0x3FFFFF;
                entry.name = str_pool.readAt(name_off, 'string');
                entry.notes = str_pool.readAt(entryStruct.string_off, 'string');
                let validIndex = Boolean(bitfield >> 31);
                if (validIndex) {
                    entry.index = (bitfield >> 24) & 0x7F;
                    if (entry.index > this.#max_global_index)
                        this.#max_global_index = entry.index;
                }
                params.push(entry);
            }
            this.global_params[t] = params;
        }
        let paramEntryEnd = data.tell();
    
        for (let t in this.global_params) {
            data.seek(paramEntryEnd + this.global_header[t].first_param_rel_off);
            for (let entry in this.global_params[t]) {
                this.global_params[t][entry].defaultValue = this.#readParam(data, t);
            }
        }

        this.global_refs = new Array;
        for (let i = 0; i <= this.#max_global_index; i++) {
            let entry = data.readNext('global_param_file_ref', true);
            entry.filename = str_pool.readAt(entry.name_off, 'string');
            delete entry.name_off;
        }

        for (let t in this.global_params) {
            for (let entry in this.global_params[t]) {
                let index = this.global_params[t][entry].index;
                if (typeof index !== 'undefined') {
                    this.global_params[t][entry].file_ref = this.global_refs[index];
                    delete this.global_params[t][entry].index;
                }
            }
        }
    }

    #readImmediateParams() {
        let data = this.#data;

        data.seek(this.header.imm_param_off);
        let imm_param_header = new Array;
        for (let i = 0; i < standardTypes.length; i++) {
            imm_param_header.push(data.readNext('u32', true));
        }
        this.imm_params = new Object;
        for (let i = 0; i < standardTypes.length; i++) {
            let t = standardTypes[i];
            let end_off;
            if (i < 5) {
                end_off = imm_param_header[i + 1];
            } else {
                end_off = this.header.io_param_off;
            }
            data.seek(imm_param_header[i]);
            this.imm_params[t] = new Array;
            while (data.tell() < end_off) {
                this.imm_params[t].push(this.#readImmediateParam(t));
            }
        }
    }

    #readImmediateParam(type) {
        let ret;

        if (type == 'userdefined') {
            ret = this.#data.readNext('imm_param_userdefined', true, {str_pool: this.#str_pool});
        } else {
            ret = this.#data.readNext('imm_param', true, {str_pool: this.#str_pool});
        }

        if (ret.flags.value === 0) delete ret.flags;

        if (type !== 'userdefined') 
            ret.value = this.#readParam(type);

        return ret;
    }

    #readAttachParams() {
        let data = this.#data;

        this.attach_param = new Array;
        if (this.header.attach_param_count > 0) {
            data.seek(this.header.attach_param_off); 
            do {
                let entry;
                if (this.header.version == 0x0404)
                    entry = data.readNext('attach_param_entry', true);
                else
                    entry = data.readNext('attach_param_entry_0407', true);
                entry.name = str_pool.readAt(entry.name_off, 'string');
                delete entry.name_off;
                this.attach_param.push(entry);
            } while (data.tell() < this.attach_param[0].sub_param_entry_off);
            for (let param of this.attach_param) {
                data.seek(param.sub_param_entry_off);
                param.sub_param = data.readNext('attach_sub_param', true);
                delete param.sub_param_entry_off;
            }
            this.attach_array = new Array;
            data.seek(this.header.attach_param_index_list_off);
            while (data.tell() < this.header.attach_param_off) {
                this.attach_array.push(data.readNext('u32', true));
            }
        }
    }

    #readIOParams() {
        let data = this.#data;

        data.seek(this.header.io_param_off);
        let io_offsets = this.#readIOHeader();
        this.input_params = new Object;
        this.output_params = new Object;
        for (let i = 0; i < standardTypes.length; i++) {
            let type = standardTypes[i];
            this.input_params[type] = new Array;
            this.output_params[type] = new Array;

            while (data.tell() < io_offsets.output_param_off[type]) {
                this.input_params[type].push(this.#readInputParam(type));
            }

            let next_offset = (i < 5)? io_offsets.input_param_off[standardTypes[i + 1]] : this.header.multi_param_off;

            while (data.tell() < next_offset) {
                this.output_params[type].push(this.#readOutputParam(type));
            }
        }

        for (let t of standardTypes) {
            let input_t = this.input_params[t];
            for (let param of input_t) {
                if (typeof param.multi_index !== 'undefined') {
                    param.sources = new Array;
                    data.seek(this.header.multi_param_off + param.multi_index * 8);
                    for (let i = 0; i < param.multi_count; i++) {
                        param.sources.push(this.#readMultiParam())
                    }
                }
            }
        }
    }

    #readIOHeader() {
        let ret = new Object;
        ret.input_param_off = new Object;
        ret.output_param_off = new Object;
        for (let t of standardTypes) {
            ret.input_param_off[t] = this.#data.readNext('u32', true);
            ret.output_param_off[t] = this.#data.readNext('u32', true);
        }
        return ret;
    }

    #readInputParam(type) {
        let ret;
        if (type === 'userdefined') {
            ret = this.#data.readNext('input_param_userdefined', true);
            ret.class_name = this.#str_pool.readAt(ret.class_name_off, 'string');
            delete ret.class_name_off;
        } else {
            ret = this.#data.readNext('input_param', true, {str_pool: this.#str_pool, type});
            if (type === 'string') {
                let str_off = this.#data.readNext('u32', true);
                ret.default_value = this.#str_pool.readAt(str_off, 'string');
            } else {
                ret.default_value = this.#data.readNext(type, true);
            }
        }

        if (ret.input_child_index <= -100 && ret.input_child_index >= -8192) {
            ret.multi_index = -100 - ret.input_child_index;
            ret.multi_count = ret.io_source_index;
        }

        let flags = ret.flags;
        ret.flags = this.#getParamFlags(flags);
        if (Object.keys(ret.flags).length == 0)
            delete ret.flags;

        return ret;
    }

    #readOutputParam(type) {
        let ret = new Object;
        let flags = this.#data.readNext('u32', true);
        ret.name = this.#str_pool.readAt(flags & 0x3FFFFFFF, 'string');
        if (flags &= 0x80000000)
            ret.isOutput = true;
        
        if (type == 'userdefined') {
            let class_name_off = this.#data.readNext('u32', true);
            ret.class_name = this.#str_pool.readAt(class_name_off, 'string');
        }

        return ret;
    }

    #readMultiParam() {
        let ret = this.#data.readNext('multi_param', true);

        let flags = ret.flags;
        ret.flags = this.#getParamFlags(flags);
        if (Object.keys(ret.flags).length == 0)
            delete ret.flags;

        return ret;
    }

    #getParamFlags(flags) {
        let ret = new Array;

        if (flags & 0x80)
            ret.push('Pulse TLS');
        if (flags & 0x100)
            ret.push('Is Output');
        if (flags & 0x2c00 == 0x2c00)
            throw new Error('EXB section not implemented yet.');
        else if (flags & 0x8000)
            ret.push('Blackboard');

        return ret;
    }

    #readResidentUpdateArray() {
        let data = this.#data;

        data.seek(this.header.resident_update_array_off);
        this.resident_update_array = new Array;
        if (this.header.resident_update_array_off != this.header.precondition_node_array_off) {
            let offsets = [data.readNext('u32', true)];
            while(data.tell() < offsets[0])
                offsets.push(data.readNext('u32', true));
            for (let offset of offsets) {
                data.seek(offset);
                this.resident_update_array.push(offset); // TODO
            }
        }
    }

    #readPreconditionNodes() {
        let data = this.#data;

        data.seek(this.header.precondition_node_array_off);
        this.precondition_nodes = new Array;
        while(data.tell() < this.header.embedded_ainb_off) {
            this.precondition_nodes.push(data.readNext('u16', true));
            data.readNext('u16', true);
        }
    }

    #readEntryStrings() {
        let data = this.#data;

        data.seek(this.header.entry_str_off);
        this.entry_strings = new Array;

        let count = data.readNext('u32', true);
        for (let i = 0; i < count; i++) {
            this.entry_strings.push(this.#readEntryStringEntry());
        }
    }

    #readEntryStringEntry() {
        let ret = new Object;

        ret.node_index = this.#data.readNext('u32', true);
        let main_state = this.#str_pool.readAt(this.#data.readNext('u32', true), 'string');
        let state = this.#str_pool.readAt(this.#data.readNext('u32', true), 'string');
        ret[main_state] = state;

        return ret;
    }

    #readEmbeddedAINB() {
        let data = this.#data;

        data.seek(this.header.embedded_ainb_off);
        this.embedded_ainb = new Array;

        let count = data.readNext('u32', true);
        for (let i = 0; i < count; i++) {
            this.entry_strings.push(this.#readEmbeddedAINBfile());
        }
    }

    #readEmbeddedAINBfile() {
        let ret = new Object;

        ret.file_path = this.#str_pool.readAt(this.#data.readNext('u32', true), 'string');
        ret.file_category = this.#str_pool.readAt(this.#data.readNext('u32', true), 'string');
        ret.count = this.#data.readNext('u32', true);
        
        return ret;
    }

    #readFileHashes() {
        let data = this.#data;

        data.seek(this.header.file_ident_hash_off);

        this.file_hashes = new Array;
        this.file_hashes.push(data.readNext('u32', true));
        this.file_hashes.push(data.readNext('u32', true));
    }

    #readNodes() {
        let data = this.#data;

        data.seek(this.#command_end);

        this.nodes = new Array;
        for (let i = 0; i < this.header.node_count; i++) {
            this.nodes.push(this.#readNode());
        }
    }

    #readNode() {
        let ret = this.#data.readNext('file_node_list', true);

        return ret;
    }
}

module.exports = AINB;