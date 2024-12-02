const fs = require('fs');
const { Struct } = require('structjs');

new Struct(fs.readFileSync('./classes_generated/struct_glob_uniq_id.txt', 'utf8'), 'glob_uniq_id');
new Struct(fs.readFileSync('./classes_generated/struct_vec3f.txt', 'utf8'), 'vec3f');
new Struct(fs.readFileSync('./classes_generated/struct_ainb_header.txt', 'utf8'), 'ainb_header');
new Struct(fs.readFileSync('./classes_generated/struct_commands_list.txt', 'utf8'), 'commands_list');
new Struct(fs.readFileSync('./classes_generated/struct_file_node_list.txt', 'utf8'), 'file_node_list');
new Struct(fs.readFileSync('./classes_generated/struct_global_param_entry.txt', 'utf8'), 'global_param_entry');
new Struct(fs.readFileSync('./classes_generated/struct_global_param_section_header.txt', 'utf8'), 'global_param_section_header');
new Struct(fs.readFileSync('./classes_generated/struct_global_param_file_ref.txt', 'utf8'), 'global_param_file_ref');
new Struct(fs.readFileSync('./classes_generated/struct_imm_param_header.txt', 'utf8'), 'imm_param_header');
new Struct(fs.readFileSync('./classes_generated/struct_imm_param.txt', 'utf8'), 'imm_param');
new Struct(fs.readFileSync('./classes_generated/struct_imm_param_userdefined.txt', 'utf8'), 'imm_param_userdefined');
new Struct(fs.readFileSync('./classes_generated/struct_attach_param_entry.txt', 'utf8'), 'attach_param_entry');
new Struct(fs.readFileSync('./classes_generated/struct_attach_sub_param.txt', 'utf8'), 'attach_sub_param');
new Struct(fs.readFileSync('./classes_generated/struct_input_param.txt', 'utf8'), 'input_param');
new Struct(fs.readFileSync('./classes_generated/struct_input_param_userdefined.txt', 'utf8'), 'input_param_userdefined');
new Struct(fs.readFileSync('./classes_generated/struct_multi_param.txt', 'utf8'), 'multi_param');

for (let structName in Struct.loadedStructs) {
    let struct = Struct.loadedStructs[structName];
    if (struct instanceof Struct) {
        fs.writeFileSync(`./classes_generated/${struct.name}.js`, struct.toClass(), 'utf8');
    }
}