"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_7_pt1());
    console.log(solve_dec_7_pt2());
};

module.exports = {
    start
};


const solve_dec_7_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec7.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));

        // Build a list of all combinations of 0-4
        let inputs = new Set<number[]>();
        for(let a = 0; a < 5; a++){
            for(let b = 0; b < 5; b++){
                for (let c = 0; c < 5; c++){
                    for (let d = 0; d < 5; d++){
                        for (let e = 0; e < 5; e++){
                            let array = [a, b, c, d, e];
                            let tester = new Set(array);
                            if (tester.size === 5)
                                inputs.add(array);
                        }
                    }
                }
            }
        }
        
        let largest = 0;
        for(let sequence of Array.from(inputs.values())){
            let first = intcode_runner(parts, [sequence[0],0])[0];
            let second = intcode_runner(parts, [sequence[1],first])[0];
            let third = intcode_runner(parts, [sequence[2],second])[0];
            let fourth = intcode_runner(parts, [sequence[3],third])[0];
            let fifth = intcode_runner(parts, [sequence[4],fourth])[0];
            if (fifth > largest)
                largest = fifth;
        }
        
        return largest;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_7_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec7.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));

        // Build a list of all combinations of 0-4
        let inputs = new Set<number[]>();
        for(let a = 5; a < 10; a++){
            for(let b = 5; b < 10; b++){
                for (let c = 5; c < 10; c++){
                    for (let d = 5; d < 10; d++){
                        for (let e = 5; e < 10; e++){
                            let array = [a, b, c, d, e];
                            let tester = new Set(array);
                            if (tester.size === 5)
                                inputs.add(array);
                        }
                    }
                }
            }
        }

        let largest = 0;

        for(let sequence of Array.from(inputs.values())){
            console.log(sequence);
            let firstInputs = [sequence[0],0];
            let secondInputs = [sequence[1]];
            let thirdInputs = [sequence[2]];
            let fourthInputs = [sequence[3]];
            let fifthInputs = [sequence[4]];
            let result = true;
            let count = 0;

            while(result){
                let temp = intcode_runner(JSON.parse(JSON.stringify(parts)), JSON.parse(JSON.stringify(firstInputs)));
                secondInputs.push(temp[0]);
                temp = intcode_runner(JSON.parse(JSON.stringify(parts)), JSON.parse(JSON.stringify(secondInputs)));
                thirdInputs.push(temp[0]);
                temp = intcode_runner(JSON.parse(JSON.stringify(parts)), JSON.parse(JSON.stringify(thirdInputs)));
                fourthInputs.push(temp[0]);
                temp = intcode_runner(JSON.parse(JSON.stringify(parts)), JSON.parse(JSON.stringify(fourthInputs)));
                fifthInputs.push(temp[0]);
                temp = intcode_runner(JSON.parse(JSON.stringify(parts)), JSON.parse(JSON.stringify(fifthInputs)));
                firstInputs.push(temp[0]);

                result = temp[2];
                count = temp[0];
            }

            if (count > largest)
                largest = count;
            console.log(count);
        }
        
        return largest;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const intcode_runner = (instructions: number[], inputs: number[]) => {
    try {
        // console.log(inputs);
        let position = 0;
        let output = inputs[0];
        let input = 0;
        let inputHalt = false;
        while (instructions[position] != 99) {
            // console.log(position + ": " + instructions);
            // console.log(instructions[position]);
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
                
                // console.log("ADD " + arg1 + " to " + arg2 + " in " + dest);
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
            
                // console.log("MULT " + arg1 + " by " + arg2 + " in " + dest);
                instructions[dest] = arg1 * arg2;
                position += 4;     
            }
            if (op === 3) {
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 1) {
                    // console.log("IMMEDIATE");
                    input = instructions[position + 1];
                } else {
                    input = inputs.shift();
                    // console.log("SHIFT " + input + " from " + inputs);
                }
                
                // console.log("INPUT position " + dest + " value " + input);
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 1)
                    output = instructions[position + 1];
                else 
                    output = instructions[dest];
                
                // console.log("OUTPUT position " + dest + " value " + instructions[dest]);
                // Halt and pass output if we are out of inputs
                if (inputs.length === 0){
                    // console.log("INPUT HALT");
                    inputHalt = true;
                    break;
                }
                
                position += 2;     
            }
            if (op === 5) {
                let arg1 = instructions[instructions[position+1]];
                if (modes[0] && modes[0] === 1)
                    arg1 = instructions[position + 1];
                let arg2 = instructions[instructions[position+2]];
                if (modes[1] && modes[1] === 1)
                    arg2 = instructions[position + 2];
                
                // console.log("JUMP-IF-TRUE " + (arg1 > 0) + " : " + arg2);
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
                
                // console.log("JUMP-IF-FALSE " + (arg1 === 0) + " : " + arg2);
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
        return [output, instructions, inputHalt];
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();



