const fs = require('fs');

const AINB = require('./ainb.js');

let ainb_buf = new Uint8Array(fs.readFileSync('Sdodr_golf_ball_43cb.logic.root.ainb')).buffer;
let ainb_file = new AINB(ainb_buf);