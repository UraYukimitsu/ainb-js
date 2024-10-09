const fs = require('fs');
const Struct = require('./struct.js');
const DataViewStream = require('./dataViewStream.js');

const globalParamTypes = ["string", "s32", "float", "bool", "vec3f", "userdefined"];
const standardTypes = ["s32", "bool", "float", "string", "vec3f", "userdefined"];

new Struct(fs.readFileSync('struct_glob_uniq_id.txt', 'utf8'), 'glob_uniq_id');
new Struct(fs.readFileSync('struct_vec3f.txt', 'utf8'), 'vec3f');
new Struct(fs.readFileSync('struct_ainb_header.txt', 'utf8'), 'ainb_header');
new Struct(fs.readFileSync('struct_commands_list.txt', 'utf8'), 'commands_list');
new Struct(fs.readFileSync('struct_file_node_list.txt', 'utf8'), 'file_node_list');
new Struct(fs.readFileSync('struct_global_param_section_header.txt', 'utf8'), 'global_param_section_header');
new Struct(fs.readFileSync('struct_global_param_file_ref.txt', 'utf8'), 'global_param_file_ref');
new Struct(fs.readFileSync('struct_imm_param_header.txt', 'utf8'), 'imm_param_header');
new Struct(fs.readFileSync('struct_imm_param.txt', 'utf8'), 'imm_param');
new Struct(fs.readFileSync('struct_imm_param_userdefined.txt', 'utf8'), 'imm_param_userdefined');

class AINB {
    #data;
    #str_pool_data;
    #max_global_index = 0;
    header;
    commands;
    global_header;
    global_params;
    global_refs;
    filename;
    category_name;
    exb;
    imm_param_header;
    imm_params;
    
    constructor(buffer) {
        if (!ArrayBuffer.prototype.isPrototypeOf(buffer))
            throw new TypeError('Parameter buffer is not of type ArrayBuffer.');

        this.#data = new DataViewStream(buffer);
        let data = this.#data;
    
        this.header = data.readNext('ainb_header', true);

        this.#str_pool_data = new DataViewStream(buffer, this.header.str_pool_off);
        let str_pool = this.#str_pool_data;
    
        if (this.header.magic.join('') !== 'AIB ') 
            throw new Error(`Invalid magic '${this.header.magic.join('')}' - expected 'AIB '.`)
        
        if ([0x0404, 0x0407].indexOf(this.header.version) < 0) 
            throw new Error(`Invalid version 0x${this.header.version.toString(16)} - expected 0x0404 or 0x0407.`);
        
        this.filename = str_pool.readAt(this.header.filename_off, 'string');
        this.category_name = str_pool.readAt(this.header.file_category_name_off, 'string');
    
        this.commands = new Array;
    
        for (let i = 0; i < this.header.command_count; i++) {
            let command = data.readNext('commands_list', true);
            this.commands.push(command);
        }
        let commandEnd = data.tell();
    
        data.seek(this.header.global_param_off);
        this.global_header = new Object;
        this.global_params = new Object;
    
        this.#readGlobalParams();

        this.exb = new Object;
        if (this.header.exb_section_off != 0) {
            throw new Error('EXB section not implemented yet.'); // unused in Splatoon 3?
        }

        data.seek(this.header.imm_param_off);
        this.imm_param_header = new Array;
        for (let i = 0; i < standardTypes.length; i++) {
            this.imm_param_header.push(data.readNext('u32', true));
        }
        this.imm_params = new Object;
        for (let i = 0; i < standardTypes.length; i++) {
            let t = standardTypes[i];
            let end_off;
            data.seek(this.imm_param_header[i]);
            this.imm_params[t] = new Array;
            if (i < 5) {
                end_off = this.imm_param_header[i + 1];
            } else {
                end_off = this.header.io_param_off;
            }
            while (data.tell() < end_off) {
                this.imm_params[t].push(this.#readImmediateParam(t));
            }
        }
    }

    #readParam(type) {
        switch (type) {
            case 'string':
                let off = this.#data.readNext('u32', true);
                return this.#str_pool_data.readAt(off, 'string');
    
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
        let str_pool = this.#str_pool_data;

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
            let filename = str_pool.readAt(entry.name_off, 'string');
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

    #readImmediateParam(type) {
        let data = this.#data;
        let str_pool = this.#str_pool_data;

        let ret;

        if (type == 'userdefined') {
            ret = data.readNext('imm_param_userdefined', true);
            ret.class_name = str_pool.readAt(ret.class_name_off, 'string');
            delete ret.class_name_off;
        } else {
            ret = data.readNext('imm_param', true);
        }

        ret.name = str_pool.readAt(ret.name_off, 'string');
        delete ret.name_off;

        let flags = ret.flags;
        ret.flags = new Object;

        if (ret.flags) {
            if (flags & 0x80)
                ret.flags.push('Pulse TLS');
            if (flags & 0x100)
                ret.flags.push('Is Output');
            if ((flags & 0xc200) == 0xc200)
                throw new Error('EXB section not implemented yet.');
            else if (flags & 0x8000)
                ret.flags.push('Blackboard');
            else
                delete ret.index;
        }
        if (Object.keys(ret.flags).length == 0)
            delete ret.flags;

        if (type !== 'userdefined') 
            ret.value = this.#readParam(type);

        return ret;
    }
}

module.exports = AINB;