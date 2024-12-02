const { Struct } = require('structjs');

class vec3f {
    static get sizeof() { return 12; }
    static get name() { return 'vec3f'; }

    x;
    y;
    z;

    static read(data, position, isLittleEndian) {
        let x = Struct.readValue(data, position + 0, 'float', isLittleEndian).value;
        let y = Struct.readValue(data, position + 4, 'float', isLittleEndian).value;
        let z = Struct.readValue(data, position + 8, 'float', isLittleEndian).value;

        return new vec3f(x, y, z);
    }

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static {
        Struct.registerFromClass(vec3f);
    }
}

module.exports = vec3f;