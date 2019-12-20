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
    let outPattern = new Array<number>(signal.length)
    let localSignal = JSON.parse(JSON.stringify(signal));
    // 37325517 was Too Low -- Save and Continue is borked
    // 93242475 was Too High -- Troubleshoot!
    // 49476260
    for(let i = 0; i < signal.length; i++) {
        // Can we ignore the first half? We only ever look at the back side
        if (i < signal.length / 2){
            outPattern[i] = 0;
            continue;    
        }
        if (i % 10000 == 0) console.log("Row " + i + " / " + signal.length);
        let localRow = 0;
        
        if (i * 4 > signal.length) {
            let add = getRangeForSign(i, 1);
            let sub = getRangeForSign(i, -1);
            if (add[1] > signal.length - 1) add[1] = signal.length - 1;
            for(let j = add[0]; j <= add[1]; j++){
                localRow += localSignal[j];
            }
            if (sub[0] <= signal.length){
                if (sub[1] > signal.length - 1) sub[1] = signal.length - 1;
                for(let j = sub[0]; j <= sub[1]; j++){
                    localRow -= localSignal[j];
                }
            }
        } else {    
            for(let j = 0; j < signal.length; j++){
                localRow += localSignal[j] * getPhasePattern(i, j);
            }
        }
        
        outPattern[i] = Math.abs(localRow % 10);
    }
    return outPattern;
}

// Calculate range at each iteration for 1,1,1,1 and -1,-1,-1,-1; try to cut out 0's
const getRangeForSign = (iteration, sign) => {
    // Iteration = 0:  [1, 0, -1, 0]    1 Start: 0, End: 0       -1 Start: 2, End: 2     
    // Iterations = 1: [0, 1, 1, 0, 0, -1, -1, 0]   1 Start: 1, End: 2      -1 Start: 5, End: 6
    // Iteration  = 2: [0, 0,  1, 1, 1, 0, 0, 0, -1, -1, -1, 0]     1 Start: 2, End: 4      -1 Start 8, End 10
    if (sign === 1){
        return [iteration, 2 * iteration];
    }
    if (sign === -1){
        return [(iteration * 3) + 2, (iteration * 3) + 2 + iteration];
    }
}

const getPhasePattern = (iteration, position) => {
    let n = iteration + 1;
    let phaseLength = n * 4;
    let shiftPosition = (position + 1) % phaseLength;
    if (shiftPosition < n) return 0;   
    if (shiftPosition >= n && shiftPosition < (2*n)) return 1;
    if (shiftPosition >= (2*n) && shiftPosition < (n * 3)) return 0;
    return -1;
}

const solve_dec_16_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec16.txt', 'utf8');
        let superData = "";
        let iterations = 1656;
        for(let i = 0; i < iterations; i++){ 
            superData += data;
        }

        const signal = superData.split('').map(numStr => parseInt(numStr));

        let lastSignal = JSON.parse(JSON.stringify(signal));
        for (let i = 0; i < 100; i++){
            console.log("Processing Phase " + i);
            lastSignal = crunchPhase(lastSignal);
        }
        fs.appendFileSync('scratch.day16.final.txt', lastSignal.join(''));
        console.log(lastSignal.join(''));
        
        // lastSignal = testSolution.split('');
        let offset = (10000 * data.length) - parseInt(data.substring(0,7));
        let startOffset= (superData.length) - offset;
        
        for(let i = startOffset; i < startOffset + 8; i++){
            console.log(lastSignal[i]);
        }

        return "@";
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();



