"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_2_pt1());   // 6627023
    console.log(solve_dec_2_pt2());
    // 4119 too high
    // console.log(intcode_runner(40, 19));
    // 19690720
};

module.exports = {
    start
};


const solve_dec_2_pt1 = () => {
    return intcode_runner(12, 2);
}


const solve_dec_2_pt2 = () => {
    let nounTracker = 0;
    let verbTracker = 0;
    let result = 0;
    while( nounTracker < 100 || verbTracker < 100){
        result = intcode_runner(nounTracker, verbTracker);
        if (result === 19690720) break;
        if (nounTracker > 99){
            nounTracker = 0;
            verbTracker += 1;
        } else {
            nounTracker += 1;
        }
    } 
    console.log("Noun: " + nounTracker + ", Verb: " + verbTracker);
    return (100 * nounTracker) + verbTracker;
}

const intcode_runner = (noun: number, verb: number) => {
    try {
        console.log("Calculating " + noun + ", " + verb);
        let data = fs.readFileSync('src/test.dec2.txt', 'utf8');
        // const lines = data.split('\n');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let position = 0;
        parts[1] = noun;
        parts[2] = verb;
        while (parts[position] != 99){
            let op = parts[position];
            let arg1 = parts[parts[position+1]];
            let arg2 = parts[parts[position+2]];
            let dest = parts[position+3];
            if (op === 1) {
                // console.log("ADD " + arg1 + " to " + arg2 + " in " + dest);
                parts[dest] = arg1 + arg2;
            }
            if (op === 2) {
                // console.log("Mult " + arg1 + " by " + arg2 + " in " + dest);
                parts[dest] = arg1 * arg2;     
            }
            position += 4;
        }
        return parts[0];
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



