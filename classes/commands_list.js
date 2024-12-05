const { Struct } = require('structjs');

class commands_list {
    static get sizeof() { return 24; }
    static get name() { return 'commands_list'; }

    /**
     * @type {string}
     */
    name;
    /**
     * @type {glob_uniq_id}
     */
    guid;
    /**
     * @type {number}
     */
    left_node_index;
    /**
     * @type {number}
     */
    right_node_index;

    /**
     * @param {DataView} data - The DataView containing the binary data.
     * @param {number} position - The position in the DataView where the bitfield starts.
     * @param {boolean} isLittleEndian - Indicates if the data is in little-endian format.
     * @param {DataViewStream} str_pool - The DataViewStream pointing to the string pool of the AINB file.
     * @returns {commands_list} - The resulting commands list item.
     */
    static read(data, position, isLittleEndian, {str_pool}) {
        let fromObj = new Object;
        fromObj['name'] = str_pool.readAt(Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value, 'string');
        fromObj['guid'] = Struct.readValue(data, position + 4, 'glob_uniq_id', isLittleEndian, undefined).value;
        fromObj['left_node_index'] = Struct.readValue(data, position + 20, 'u16', isLittleEndian, undefined).value;
        fromObj['right_node_index'] = Struct.readValue(data, position + 22, 'u16', isLittleEndian, undefined).value;

        return new commands_list({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.name = options.fromObj['name'];
            this.guid = options.fromObj['guid'];
            this.left_node_index = options.fromObj['left_node_index'];
            this.right_node_index = options.fromObj['right_node_index'];
        }
    }

    static {
        Struct.registerFromClass(commands_list);
    }
}

module.exports = commands_list;