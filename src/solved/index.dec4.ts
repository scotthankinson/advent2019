"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    //console.log(solve_dec_4_pt1());
    // 902 too high
    console.log(solve_dec_4_pt1());
};

module.exports = {
    start
};


const solve_dec_4_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec4.txt', 'utf8');
        // const lines = data.split('\n');
        const bounds = data.split('-');
        const lower = parseInt(bounds[0]);
        const upper = parseInt(bounds[1]);
        let validPW = 0;
        for(let i = lower; i <= upper; i++){
            if (testPassword(i))
                validPW += 1;
        }
        return validPW;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const testPassword = (input: number): boolean => {
    let digits = [];
    while(input > 0){
        digits.push(input % 10);
        input = Math.floor(input / 10);
    }
    digits = digits.reverse();
    let adjacent = false;
    let digit = digits[0];
    for(let i = 1; i < 6; i++) {
        // Part 1
        // if (digits[i] === digit)
        //    adjacent = true;
        // Part 2
        if (digits[i] === digit && digits.filter(o => o === digit).length === 2)
            adjacent = true;
        if (digits[i] >= digit){
            digit = digits[i];
        } else {
            return false;
        }
    }
    if (adjacent)
        console.log(digits);
    return adjacent;
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



