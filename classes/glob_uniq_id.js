const { Struct } = require('structjs');

class glob_uniq_id {
    static get sizeof() { return 16; }
    static get name() { return 'glob_uniq_id'; }

    #glob_uniq_id1;
    #glob_uniq_id2;
    #glob_uniq_id3;
    #glob_uniq_id4;
    #glob_uniq_id5;

    get guid() { return this.toString(); }
    set guid(value) {
        const guid_pattern = /^([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})$/;
        if (!guid_pattern.test(value))
            throw new TypeError('The value is not a valid GUID.');

        let match = guid_pattern.exec(value);
        this.#glob_uniq_id1 = Number.parseInt(match[1], 16);
        this.#glob_uniq_id2 = Number.parseInt(match[2], 16);
        this.#glob_uniq_id3 = Number.parseInt(match[3], 16);
        this.#glob_uniq_id4 = Number.parseInt(match[4], 16);

        for(let i = 0; 2 * i < match[5].length; i++) {
            this.#glob_uniq_id5[i] = Number.parseInt(match[5].slice(2 * i, 2 * i + 2), 16);
        }
    }

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['#glob_uniq_id1'] = Struct.readValue(data, position + 0, 'u32', isLittleEndian, undefined).value;
        fromObj['#glob_uniq_id2'] = Struct.readValue(data, position + 4, 'u16', isLittleEndian, undefined).value;
        fromObj['#glob_uniq_id3'] = Struct.readValue(data, position + 6, 'u16', isLittleEndian, undefined).value;
        fromObj['#glob_uniq_id4'] = Struct.readValue(data, position + 8, 'u16', isLittleEndian, undefined).value;
        fromObj['#glob_uniq_id5'] = new Array;
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 10, 'u8', isLittleEndian, undefined).value);
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 11, 'u8', isLittleEndian, undefined).value);
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 12, 'u8', isLittleEndian, undefined).value);
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 13, 'u8', isLittleEndian, undefined).value);
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 14, 'u8', isLittleEndian, undefined).value);
        fromObj['#glob_uniq_id5'].push(Struct.readValue(data, position + 15, 'u8', isLittleEndian, undefined).value);

        return new glob_uniq_id({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.#glob_uniq_id1 = options.fromObj['#glob_uniq_id1'];
            this.#glob_uniq_id2 = options.fromObj['#glob_uniq_id2'];
            this.#glob_uniq_id3 = options.fromObj['#glob_uniq_id3'];
            this.#glob_uniq_id4 = options.fromObj['#glob_uniq_id4'];
            this.#glob_uniq_id5 = options.fromObj['#glob_uniq_id5'];
        }
    }

    toString() {
        return `${this.#glob_uniq_id1.toString(16).padStart(8, '0')}-` +
            `${this.#glob_uniq_id2.toString(16).padStart(4, '0')}-` +
            `${this.#glob_uniq_id3.toString(16).padStart(4, '0')}-` +
            `${this.#glob_uniq_id4.toString(16).padStart(4, '0')}-` +
            `${this.#glob_uniq_id5.map(b => b.toString(16).padStart(2, '0')).join('')}`;
    }

    toJSON() {
        return this.toString();
    }

    static {
        Struct.registerFromClass(glob_uniq_id);
    }
}

module.exports = glob_uniq_id;