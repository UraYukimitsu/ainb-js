const fs = require('fs');
const struct = require('./struct.js');

const globalParamTypes = ["string", "uint32", "float", "bool", "vec3f", "userdefined"];
const standardTypes = ["uint32", "bool", "float", "string", "vec3f", "userdefined"];

struct.loadStruct(fs.readFileSync('struct_glob_uniq_id.txt', 'utf8'), 'glob_uniq_id');
struct.loadStruct(fs.readFileSync('struct_ainb_header.txt', 'utf8'), 'ainb_header');
struct.loadStruct(fs.readFileSync('struct_commands_list.txt', 'utf8'), 'commands_list');
struct.loadStruct(fs.readFileSync('struct_file_node_list.txt', 'utf8'), 'file_node_list');
struct.loadStruct(fs.readFileSync('struct_global_param_section_header.txt', 'utf8'), 'global_param_section_header');
struct.loadStruct(fs.readFileSync('struct_vec3f.txt', 'utf8'), 'global_param_section_header');

class AINB {
    #data;
    #seek_head;
    #str_pool_data;
    header;
    commands;
    global_header;
    global_params;
    filename;
    
    constructor(buffer) {
        if (!ArrayBuffer.prototype.isPrototypeOf(buffer))
            throw new TypeError('Parameter buffer is not of type ArrayBuffer.');

        this.#data = new DataView(buffer);
    
        this.#seek_head = 0;
        let header = struct.readValue(this.#data, 0, 'ainb_header', true).value;
        this.#seek_head += header.count;
    
        this.header = header.props;
    
        if (this.header.magic.join('') !== 'AIB ') 
            throw new Error(`Invalid magic '${this.header.magic.join('')}' - expected 'AIB '.`)
        
        if ([0x0404, 0x0407].indexOf(this.header.version) < 0) 
            throw new Error(`Invalid version 0x${this.header.version.toString(16)} - expected 0x0404 or 0x0407.`);
        
        this.#str_pool_data = new DataView(buffer, this.header.str_pool_off);
        this.filename = struct.readValue(this.#str_pool_data, this.header.filename_off, 'string', true).value;
        this.categoryName = struct.readValue(this.#str_pool_data, this.header.file_category_name_off, 'string', true).value;
    
        this.commands = new Array;
    
        for (let i = 0; i < this.header.command_count; i++) {
            let command = struct.readValue(this.#data, this.#seek_head, 'commands_list', true);
            this.commands.push(command.value.props);
            this.#seek_head += command.count;
        }
        let commandEnd = this.#seek_head;
    
        this.#seek_head = this.header.global_param_off;
        this.global_header = {};
        this.global_params = {};
    
        for (let t in globalParamTypes) {
            let hdr = struct.readValue(this.#data, this.#seek_head, 'global_param_section_header', true);
            this.global_header[globalParamTypes[t]] = hdr.value.props;
            this.#seek_head += hdr.count;
        }
    
        for (let t in this.global_header) {
            let params = new Array;
            for (let i  = 0; i < this.global_header[t].entry_count; i++) {
                let entry = struct.readValue(this.#data, this.#seek_head, 'global_param_entry', true);
                params.push(entry.value.props);
                this.#seek_head += entry.count;
            }
            this.global_params[t] = params;
        }
        let paramEntryEnd = this.#seek_head;
    
        for (let t in this.global_params) {
            this.#seek_head = paramEntryEnd + this.global_header[t].first_param_rel_off;
            for (let entry in this.global_params[t]) {
                let defaultValue = this.#readDefaultParam(this, this.#data, this.#seek_head, t);
                this.global_params[t][entry].defaultValue = defaultValue.value;
                this.#seek_head += defaultValue.count;
            }
        }
    }

    #readDefaultParam(position, type) {
        let ret;
        switch (type) {
            case 'string':
                let off = struct.readValue(this.#data, position, 'uint32', true);
                ret = struct.readValue(this.#str_pool_data, off.value, 'string', true);
                ret.count = off.count;
                break;
    
            case 'uint32':
            case 'float':
            case 'bool':
            case 'vec3f':
                ret = struct.readValue(this.#data, position, type, true);
                break;

            case 'userdefined':
                ret = JSON.parse('{"count": 0, "value": null}');
                break;

            default:
                throw new Error("This shouldn't happen.");
        }
        return ret;
    }
}

module.exports = AINB;