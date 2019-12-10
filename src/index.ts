"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_4_pt1());
    // console.log(solve_dec_4_pt2());
};

module.exports = {
    start
};


const solve_dec_4_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec4.txt', 'utf8');
        const lines = data.split('\n');

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_4_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec4.txt', 'utf8');
        const lines = data.split('\n');

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



