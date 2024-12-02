const fs = require('fs');

const AINB = require('./ainb.js');

let ainb_buf = new Uint8Array(fs.readFileSync('Sdodr_meadow_ball_38f9.logic.root.ainb')).buffer;
let ainb_file = new AINB(ainb_buf);

console.log(JSON.stringify(ainb_file, null, 2));