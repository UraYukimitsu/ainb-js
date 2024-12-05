const { Struct } = require('structjs');

class vec3f {
    static get sizeof() { return 12; }
    static get name() { return 'vec3f'; }

    x;
    y;
    z;

    static read(data, position, isLittleEndian) {
        let fromObj = new Object;
        fromObj['x'] = Struct.readValue(data, position + 0, 'float', isLittleEndian, undefined).value;
        fromObj['y'] = Struct.readValue(data, position + 4, 'float', isLittleEndian, undefined).value;
        fromObj['z'] = Struct.readValue(data, position + 8, 'float', isLittleEndian, undefined).value;

        return new vec3f({fromObj});
    }

    constructor(options) {
        if (typeof options.fromObj === 'object') {
            this.x = options.fromObj['x'];
            this.y = options.fromObj['y'];
            this.z = options.fromObj['z'];
        }
    }

    static {
        Struct.registerFromClass(vec3f);
    }
}

module.exports = vec3f;