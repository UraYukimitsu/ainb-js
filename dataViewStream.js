const Struct = require('./struct.js');

class DataViewStream {
    static get SEEK_SET () { return 0; }
    static get SEEK_CUR () { return 1; }
    static get SEEK_END () { return 2; }

    #buffer;
    get buffer() { return this.#buffer; }
    #data;
    #seek_head;

    constructor(buffer, offset = 0) {
        if (!ArrayBuffer.prototype.isPrototypeOf(buffer)) {
            throw new TypeError('Parameter buffer is not of type ArrayBuffer.');
        }

        this.#buffer = buffer;
        this.#data = new DataView(buffer, offset);

        this.#seek_head = 0;
    }

    seek(offset, whence = DataViewStream.SEEK_SET) {
        if (typeof offset !== 'number')
            throw new TypeError('Parameter offset should be of type number.');
        else if (Number.isNaN(offset))
            throw new Error('Parameter offset should not be NaN.');
        switch (whence) {
            case DataViewStream.SEEK_SET:
                this.#seek_head = offset;
                break;
            
            case DataViewStream.SEEK_CUR:
                this.#seek_head += offset;
                break;

            case DataViewStream.SEEK_END:
                this.#seek_head = this.#data.byteLength + offset;
                break;

            default:
                throw new TypeError('Invalid value for parameter whence.');
        }

        return this;
    }

    tell() {
        return this.#seek_head;
    }

    readNext(type, isLittleEndian = false) {
        let readValue = Struct.readValue(this.#data, this.#seek_head, type, isLittleEndian);
        this.#seek_head += readValue.count;
        return readValue.value;
    }

    readAt(offset, type, isLittleEndian = false) {
        if (typeof offset !== 'number')
            throw new TypeError('Parameter offset should be of type number.');
        else if (Number.isNaN(offset))
            throw new Error('Parameter offset should not be NaN.');
        let readValue = Struct.readValue(this.#data, offset, type, isLittleEndian);
        return readValue.value;
    }

    *[Symbol.iterator](type, isLittleEndian = false) {
        while (this.#seek_head < this.#data.byteLength) {
            yield this.readNext(type, isLittleEndian);
        }
    }
}

module.exports = DataViewStream;