"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_9_pt1());
    // console.log(solve_dec_9_pt2());
};

module.exports = {
    start
};

const solve_dec_9_pt1 = () => {
    try {
        const test1 = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99".split(',').map(numStr => parseInt(numStr));
        let test1Inputs = [];
        intcode_runner(test1, test1Inputs);
        console.log(test1Inputs + " should equal 109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99");
        
        const test2 = "1102,34915192,34915192,7,4,7,99,0".split(',').map(numStr => parseInt(numStr));
        let test2Inputs = [];
        intcode_runner(test2, test2Inputs);
        console.log(test2Inputs + " should have 16 digits (" + (("" + test2Inputs[0]).length === 16) + ")");

        const test3 = "104,1125899906842624,99".split(',').map(numStr => parseInt(numStr));
        let test3Inputs = [];
        intcode_runner(test3, test3Inputs);
        console.log(test2Inputs + " should equal 1125899906842624 (" + (test3Inputs[0] === 1125899906842624) + ")");

        // 3079728215 Too High
        // 3063082071 Fix 7/8 modes
        let data = fs.readFileSync('src/test.dec9.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let inputs = [2];
        intcode_runner(JSON.parse(JSON.stringify(parts)), inputs);
        
        return inputs;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_9_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec9.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        return -1;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

// Let intcode pull from off the list
const retrieve = (instructions, destination) => {
    if (!instructions[destination]) return 0;
    return instructions[destination];
}

const intcode_runner = (instructions: number[], inputs: number[]) => {
    try {
        // console.log(inputs);
        let position = 0;
        let relativeBase = 0;
        let output = inputs[0];
        let input = 0;
        let inputHalt = false;
        while (instructions[position] != 99) {      
            let instruction = instructions[position];
            let op = instruction % 100;
            instruction = Math.floor(instruction / 100);
            let modes = [];
            while (instruction > 0){
                modes.push(instruction % 10);
                instruction = Math.floor(instruction / 10);
            }

            if (op === 1) {
                console.log("ADD " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                let dest = instructions[position+3];
                if (modes[2] && modes[2] == 2)
                    dest += relativeBase;
                
                instructions[dest] = arg1 + arg2;
                position += 4;
            }
            if (op === 2) {
                console.log("MULT " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                let dest = instructions[position+3];
                if (modes[2] && modes[2] == 2)
                    dest += relativeBase;
                
                instructions[dest] = arg1 * arg2;
                position += 4;
            }
            if (op === 3) {
                console.log("INPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest += relativeBase;
                }
                input = inputs.shift();
                
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest = instructions[position + 1] + relativeBase;
                }                
                while (dest < 0)
                    dest += instructions.length;
                output = instructions[dest];
                
                if (modes[0] && modes[0] == 1){
                    output = dest;
                }

                inputs.push(output);
                position += 2;     
            }
            if (op === 5) {
                console.log("JUMP-IF-TRUE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                
                if (arg1 > 0)
                    position = arg2;
                else 
                    position += 3;
            }
            if (op === 6) {
                console.log("JUMP-IF-FALSE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                
                if (arg1 === 0)
                    position = arg2;
                else 
                    position += 3;
            }
            if (op === 7) {
                console.log("LESS-THAN " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                let dest = instructions[position+3];
                if (modes[2] && modes[2] == 2)
                    dest += relativeBase;
                
                if (arg1 < arg2)
                    instructions[dest] = 1;
                else 
                    instructions[dest] = 0;
                position += 4;
            }
            if (op === 8) {
                console.log("EQUALS " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
                let arg1 = retrieve(instructions, instructions[position + 1]);
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position+1]
                if (modes[0] && modes[0] === 2)
                    arg1 = retrieve(instructions, relativeBase + instructions[position + 1]);
                let arg2 = retrieve(instructions, instructions[position + 2]);
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position +2]
                if (modes[1] && modes[1] === 2)
                    arg2 = retrieve(instructions, relativeBase + instructions[position + 2]);
                let dest = instructions[position+3];
                if (modes[2] && modes[2] == 2)
                    dest += relativeBase;
                
                if (arg1 === arg2)
                    instructions[dest] = 1;
                else 
                    instructions[dest] = 0;
                position += 4;
            }
            if (op === 9) {
                console.log("UPDATE RELATIVE_BASE " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                console.log("IN: " + relativeBase);
                let dest = instructions[position+1];
                let mod = instructions[dest];
                if (modes[0] && modes[0] == 1){
                    mod = instructions[position+1];
                }
                if (modes[0] && modes[0] == 2){
                    dest += relativeBase;
                    mod = instructions[dest];
                }
                relativeBase += mod;
                console.log("OUT: " + relativeBase);
                
                // console.log("MODIFY RelativeBase by " + mod);          
                position += 2;     
            }

        }
        return [output, instructions, inputHalt];
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();

