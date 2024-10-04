if (typeof global === 'undefined')
    window.global = window;
if (typeof window === 'undefined')
    global.window = global;
if (typeof window.loadedStructs === 'undefined')
    window.loadedStructs = {};

const varSizes = {
    u8: 1, s8: 1,
    u16: 2, s16: 2,
    u32: 4, s32: 4,
    u64: 8, s64: 8,
    char: 1, bool: 4,
    float: 4,
};

const arrayPattern = /([a-z][a-z0-9]*)\[([0-9]+)\]/;

function loadStruct(structInfo, structName) {
    structInfo = structInfo.replaceAll('\r', '');
    if (typeof window.loadedStructs[structName] !== 'undefined')
        throw new Error(`struct named '${structName}' already registered.`);
    let lines = structInfo.split('\n');
    let ret = JSON.parse('{"sizeof": 0, "props": []}');

    for(let l in lines) {
        let varSize = 0;
        let isStruct = false;
        let [varType, varName] = lines[l].split(' ');
        let arrayLength = 1;
        if (varType == 'struct') {
            varType = varName;
            if (typeof window.loadedStructs[varType] === 'undefined')
                throw new Error(`No struct named '${varType}' registered.`);
            varName = lines[l].split(' ')[2];
            isStruct = true;
        }
        if (arrayPattern.test(varType)) {
            [varType, arrayLength] = arrayPattern.exec(varType).slice(1);
            arrayLength = parseInt(arrayLength);
        }
        if (typeof varSizes[varType] === 'undefined') {
            if (!isStruct)
                throw new Error(`Unknown type "${varType}".`);
        }
        if (isStruct) {
            varSize = arrayLength * window.loadedStructs[varType].sizeof;
        } else {
            varSize = arrayLength * varSizes[varType];
        }

        ret.props.push(JSON.parse(`{"type": "${varType}", "name": "${varName}", "arrayLength": ${arrayLength}}`));
        ret.sizeof += varSize;
    }

    window.loadedStructs[structName] = ret;
    return ret;
}

function readStruct(data, position, structName, isLittleEndian = false) {
    if (!DataView.prototype.isPrototypeOf(data))
        throw new TypeError('Parameter data is not of type DataView.');

    if (typeof window.loadedStructs[structName] === 'undefined')
        throw new Error(`No struct named '${structName}' registered.`);

    let iter = position;
    let struct = window.loadedStructs[structName];
    let ret = JSON.parse(`{"type": "${structName}", "props": {}}`);

    for (let p in struct.props) {
        let prop = struct.props[p];
        if (prop.arrayLength == 1) {
            let read = readValue(data, iter, prop.type, isLittleEndian);
            iter += read.count;
            ret.props[prop.name] = read.value;
        } else {
            let value = [];
            for (let i = 0; i < prop.arrayLength; i++) {
                let read = readValue(data, iter, prop.type, isLittleEndian);
                iter += read.count;
                value.push(read.value);
            }
            ret.props[prop.name] = value;
        }
    }

    return ret;
}

function readValue(data, position, type, isLittleEndian = false) {
    if (!DataView.prototype.isPrototypeOf(data))
        throw new TypeError('Parameter data is not of type DataView.');

    let ret = JSON.parse(`{"count": 0, "value": 0}`);

    if (typeof varSizes[type] !== 'undefined') {
        ret.count = varSizes[type];
    } else if (typeof window.loadedStructs[type] !== 'undefined') {
        ret.count = window.loadedStructs[type].sizeof;
    } else if (type !== 'string') {
        throw new Error(`No struct named '${type}' registered.`);
    }

    switch (type) {
        case 'u8':
            ret.value = data.getUint8(position);
            break;
        
        case 'u16':
            ret.value = data.getUint16(position, isLittleEndian);
            break;

        case 'u32':
            ret.value = data.getUint32(position, isLittleEndian);
            break;

        case 'char':
            ret.value = String.fromCharCode(data.getUint8(position));
            break;

        case 'bool':
            ret.value = !!data.getUint32(position, isLittleEndian);
            break;

        case 'float':
            ret.value = data.getFloat32(position, isLittleEndian);
            break;

        case 'string':
            ret.value = new String;
            for (let i = position; data.getUint8(i) != 0; i++) {
                ret.value += String.fromCharCode(data.getUint8(i));
                ret.count++;
            }
            ret.value += String.fromCharCode(0);
            ret.count++;
            break;

        default:
            ret.value = readStruct(data, position, type, isLittleEndian);
            break
    }

    return ret;
}

module.exports = { loadStruct, readValue };