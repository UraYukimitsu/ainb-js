const { Struct } = require('structjs');

class glob_uniq_id {
    static get sizeof() { return 16; }
    static get name() { return 'glob_uniq_id'; }

    glob_uniq_id1;
    glob_uniq_id2;
    glob_uniq_id3;
    glob_uniq_id4;
    glob_uniq_id5;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['glob_uniq_id1'] = Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value;
        fromObj['glob_uniq_id2'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['glob_uniq_id3'] = Struct.readValue(data, position + 6, 'u16', isLittleEndian, undefined).value;
        fromObj['glob_uniq_id4'] = Struct.readValue(data, position + 8, 'u16', isLittleEndian, undefined).value;
        fromObj['glob_uniq_id5'] = new Array;
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 10, 'u8', isLittleEndian, undefined).value);
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 11, 'u8', isLittleEndian, undefined).value);
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 12, 'u8', isLittleEndian, undefined).value);
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 13, 'u8', isLittleEndian, undefined).value);
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 14, 'u8', isLittleEndian, undefined).value);
        fromObj['glob_uniq_id5'].push(Struct.readValue(data, position + 15, 'u8', isLittleEndian, undefined).value);

        return new glob_uniq_id({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.glob_uniq_id1 = options.fromObj['glob_uniq_id1'];
            this.glob_uniq_id2 = options.fromObj['glob_uniq_id2'];
            this.glob_uniq_id3 = options.fromObj['glob_uniq_id3'];
            this.glob_uniq_id4 = options.fromObj['glob_uniq_id4'];
            this.glob_uniq_id5 = options.fromObj['glob_uniq_id5'];
        }
    }

    toJSON() {
        return `${this.glob_uniq_id1.toString(16).padStart(8, '0')}-` +
            `${this.glob_uniq_id2.toString(16).padStart(4, '0')}-` +
            `${this.glob_uniq_id3.toString(16).padStart(4, '0')}-` +
            `${this.glob_uniq_id4.toString(16).padStart(4, '0')}-` +
            `${this.glob_uniq_id5.map(b => b.toString(16).padStart(2, '0')).join('')}`;
    }

    static {
        Struct.registerFromClass(glob_uniq_id);
    }
}

module.exports = glob_uniq_id;