"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    //console.log(solve_dec_16_pt1());
    console.log(solve_dec_16_pt2());
};

module.exports = {
    start
};


const solve_dec_16_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec16.txt', 'utf8');
        const signal = data.split('').map(numStr => parseInt(numStr));
        const lines = data.split('\n');

        let lastSignal = JSON.parse(JSON.stringify(signal));
        for (let i = 0; i < 100; i++){
            lastSignal = crunchPhase(lastSignal);
            console.log(i + ': ' + lastSignal.join(''));
        }
        

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const crunchPhase = (signal) =>{
    let outPattern = [];

    for(let i = 0; i < signal.length; i++) {
        // console.log("Crunching digit " + i);
        let phasePattern = [];
        for(let j = 0; j < i+1; j++){
            phasePattern.unshift(-1);
        }
        for(let j = 0; j < i+1; j++){
            phasePattern.unshift(0);
        }
        for(let j = 0; j < i+1; j++){
            phasePattern.unshift(1);
        }
        for(let j = 0; j < i+1; j++){
            phasePattern.unshift(0);
        }
        // console.log(phasePattern);

        let localSignal = JSON.parse(JSON.stringify(signal));
        let localRow = 0;
        for(let j = 0; j < signal.length; j++){
            // console.log(localSignal[j] + " times " + phasePattern[(j+1)%phasePattern.length]);
            // console.log("Add " + (localSignal[j] * phasePattern[(j+1)%phasePattern.length]));
            localRow += localSignal[j] * phasePattern[(j+1)%phasePattern.length];
        }
        // console.log("Tens digit: " + Math.abs(localRow % 10));
        outPattern.push(Math.abs(localRow % 10));
    }
    return outPattern;
}

const solve_dec_16_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec16.txt', 'utf8');
        let superData = "";
        for(let i = 0; i < 34; i++){
            superData += data;
        }
        const signal = superData.split('').map(numStr => parseInt(numStr));

        let lastSignal = JSON.parse(JSON.stringify(signal));
        for (let i = 0; i < 100; i++){
            console.log("Processing Phase " + i);
            lastSignal = crunchPhase(lastSignal);
            // console.log(lastSignal.join(''));
            // console.log(i + ': ' + lastSignal.join(''));
        }
        console.log(lastSignal.join(''));
        /*
        let offset = parseInt(lastSignal.join('').substring(0,7));
        console.log("Offset: " + offset);
        for(let i = offset; i < offset + 8; i++){
            console.log(lastSignal[i]);
        }
        */

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



