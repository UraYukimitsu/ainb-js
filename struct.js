const arrayPattern = /([a-z][a-z0-9]*)\[([0-9]+)\]/;

const primitiveTypes = {
    u8:     { sizeof: 1, read: (data, position) => data.getUint8(position) },
    s8:     { sizeof: 1, read: (data, position) => data.getInt8(position) },
    u16:    { sizeof: 2, read: (data, position, isLittleEndian) => data.getUint16(position, isLittleEndian) },
    s16:    { sizeof: 2, read: (data, position, isLittleEndian) => data.getInt16(position, isLittleEndian) },
    u32:    { sizeof: 4, read: (data, position, isLittleEndian) => data.getUint32(position, isLittleEndian) },
    s32:    { sizeof: 4, read: (data, position, isLittleEndian) => data.getInt32(position, isLittleEndian) },
    u64:    { sizeof: 8, read: (data, position, isLittleEndian) => data.getBigUint64(position, isLittleEndian) },
    s64:    { sizeof: 8, read: (data, position, isLittleEndian) => data.getBigInt64(position, isLittleEndian) },
    float:  { sizeof: 4, read: (data, position, isLittleEndian) => data.getFloat32(position, isLittleEndian) },
    double: { sizeof: 8, read: (data, position, isLittleEndian) => data.getFloat64(position, isLittleEndian) },
    char:   { sizeof: 1, read: (data, position) => String.fromCharCode(data.getUint8(position)) },
    bool:   { sizeof: 4, read: (data, position, isLittleEndian) => Boolean(data.getUint32(position, isLittleEndian)) },
    string: { sizeof: undefined, read: (data, position) => {
        let ret = new Array
        for (let i = position; data.getUint8(i) != 0; i++) {
            ret.push(String.fromCharCode(data.getUint8(i)));
        }
        return(ret.join(''));
    }}
}

class Struct {
    static #loadedStructs = new Object;
    static get loadedStructs() { return Struct.#loadedStructs; }
    static {
        for (let i in primitiveTypes)
            this.#loadedStructs[i] = primitiveTypes[i];
    }

    #sizeof = 0;
    get sizeof() { return this.#sizeof; }
    #props = new Array;
    get props() { return this.#props; }
    #name;
    get name() { return this.#name; }

    constructor(structInfo, structName) {
        structInfo = structInfo.replaceAll('\r', '');
        if (typeof primitiveTypes[structName]  !== 'undefined')
            throw new Error(`Cannot redefine primitive type '${structName}'.`);
        if (typeof Struct.loadedStructs[structName] !== 'undefined')
            throw new Error(`struct named '${structName}' already registered.`);

        let lines = structInfo.split('\n');

        this.#name = structName;
    
        for(let l in lines) {
            let varSize = 0;
            let [varType, varName] = lines[l].split(' ');
            if (varType == 'string')
                throw new Error("Struct members cannot be of type 'string'. Please use a char[] array.");
            let arrayLength = 1;
            if (arrayPattern.test(varType)) {
                [varType, arrayLength] = arrayPattern.exec(varType).slice(1);
                arrayLength = parseInt(arrayLength);
            }
            if (typeof Struct.loadedStructs[varType] === 'undefined') {
                throw new Error(`No struct or type named '${varType}' registered.`);
            } else {
                varSize = arrayLength * Struct.loadedStructs[varType].sizeof;
            }
    
            this.#props.push({ "type": varType, "name": varName, "arrayLength": arrayLength });
            this.#sizeof += varSize;
        }

        Object.freeze(this.#props);

        Struct.#loadedStructs[structName] = this;
    }

    // Shorthand for readStruct
    read(data, position, isLittleEndian = false) {
        return Struct.readStruct(data, position, this.name, isLittleEndian);
    }

    static readStruct(data, position, structName, isLittleEndian = false) {
        if (!DataView.prototype.isPrototypeOf(data))
            throw new TypeError('Parameter data is not of type DataView.');
    
        if (typeof Struct.#loadedStructs[structName] === 'undefined')
            throw new Error(`No struct named '${structName}' registered.`);
    
        let iter = position;
        let struct = Struct.#loadedStructs[structName];
        let ret = {};
    
        for (let p in struct.props) {
            let prop = struct.props[p];
            if (prop.arrayLength == 1) {
                let read = Struct.readValue(data, iter, prop.type, isLittleEndian);
                iter += read.count;
                ret[prop.name] = read.value;
            } else {
                let value = [];
                for (let i = 0; i < prop.arrayLength; i++) {
                    let read = Struct.readValue(data, iter, prop.type, isLittleEndian);
                    iter += read.count;
                    value.push(read.value);
                }
                ret[prop.name] = value;
            }
        }
        return ret;
    }

    static readValue(data, position, type, isLittleEndian = false) {
        if (!DataView.prototype.isPrototypeOf(data))
            throw new TypeError('Parameter data is not of type DataView.');
    
        let ret = {count: 0, value: 0};
        let t;
    
        if (typeof Struct.#loadedStructs[type] !== 'undefined') {
            t = Struct.#loadedStructs[type];
        } else {
            throw new Error(`No struct named '${type}' registered.`);
        }
    
        ret.value = t.read(data, position, isLittleEndian);
        if (type === 'string') {
            ret.count = ret.value.length + 1;
        } else {
            ret.count = t.sizeof;
        }
    
        return ret;
    }
}

module.exports = Struct;