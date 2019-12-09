"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_5_pt1());
    // console.log(solve_dec_4_pt2());
};

module.exports = {
    start
};


const solve_dec_5_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec5.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        return intcode_runner(parts);
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_5_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec5.txt', 'utf8');
        const lines = data.split('\n');

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const intcode_runner = (instructions: number[]) => {
    try {
        let position = 0;
        let output = 5;
        let input = 1;
        while (instructions[position] != 99) {
            console.log(position + ": " + instructions);
            console.log(instructions[position]);
            let instruction = instructions[position];
            let op = instruction % 100;
            instruction = Math.floor(instruction / 100);
            let modes = [];
            while (instruction > 0){
                modes.push(instruction % 10);
                instruction = Math.floor(instruction / 10);
            }
            
            if (op === 1) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                let dest = instructions[position+3];
                
                console.log("ADD " + arg1 + " to " + arg2 + " in " + dest);
                instructions[dest] = arg1 + arg2;
                position += 4;
            }
            if (op === 2) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                let dest = instructions[position+3];
            
                console.log("MULT " + arg1 + " by " + arg2 + " in " + dest);
                instructions[dest] = arg1 * arg2;
                position += 4;     
            }
            if (op === 3) {
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 1)
                    input = instructions[position + 1];
                else 
                    input = output;
                console.log("INPUT position " + dest + " value " + output);
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 1)
                    output = instructions[position + 1];
                else 
                    output = instructions[dest];
                console.log("OUTPUT position " + dest + " value " + instructions[dest]);
                position += 2;     
            }
            if (op === 5) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                console.log("JUMP-IF-TRUE " + (arg1 > 0) + " : " + arg2);
                if (arg1 > 0)
                    position = arg2;
                else
                    position += 3
            }
            if (op === 6) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                
                console.log("JUMP-IF-FALSE " + (arg1 === 0) + " : " + arg2);
                if (arg1 === 0)
                    position = arg2;
                else
                    position += 3
            }
            if (op === 7) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                let dest = instructions[position+3];
                // console.log("LESS THAN");
                if (arg1 < arg2)
                    instructions[dest] = 1;
                else 
                    instructions[dest] = 0;
                position += 4;
            }
            if (op === 8) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                let dest = instructions[position+3];
                // console.log("EQUALS");
                if (arg1 === arg2)
                    instructions[dest] = 1;
                else 
                    instructions[dest] = 0;
                position += 4;
            }

        }
        return output;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();



