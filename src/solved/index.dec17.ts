"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_17_pt1());
    console.log(solve_dec_17_pt2());
};

module.exports = {
    start
};


const solve_dec_17_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec17.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['moveQueue'] = [];
        stateMachine['view'] = [''];
        stateMachine['currentY'] = 0;
        stateMachine['currentX'] = 0;


        intcode_runner(JSON.parse(JSON.stringify(parts)), stateMachine);

        console.log(stateMachine['view']);
        // Output is 58 wide by 34 tall
        let cornerList = new Set<string>();
        for(let y = 0; y < 35; y++){
            for(let x= 0; x < 59; x++){
                // North 
                let north, south, east, west = false;
                if (y - 1 > 0 && stateMachine[x + ',' + y] === '#' && stateMachine[x + ',' + (y - 1)] === '#')
                    north = true;
                // South
                if (y + 1 < 35 && stateMachine[x + ',' + y] === '#' && stateMachine[x + ',' + (y + 1)] === '#')
                    south = true;
                // East 
                if (x - 1 > 0 && stateMachine[x + ',' + y] === '#' && stateMachine[(x - 1) + ',' + y] === '#')
                    east = true;
                // West
                if (x + 1 < 59 && stateMachine[x + ',' + y] === '#' && stateMachine[(x + 1) + ',' + y] === '#')
                    west = true;
                if (north && south && east && west)
                    cornerList.add(x + ',' + y);
            }
        }
        let calibrate = 0;
        for(let entry of Array.from(cornerList)) {
            let coords = entry.split(',').map(numStr => parseInt(numStr));
            calibrate += coords[0] * coords[1];
        }
        // console.log(cornerList);

        return calibrate;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_17_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec17.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['moveQueue'] = [];
        stateMachine['view'] = [''];
        stateMachine['currentY'] = 0;
        stateMachine['currentX'] = 0;
        stateMachine['outputs'] = [];

        /*
        A=65, B=66, C=67, 8=56, 6=54, 5=53, ","=44, R=82, L=76, n=110, y=121, Z=10
        Solved by hand baby!
        A,A,B,C,B,C,B,A,C,A,Z
        R,8,L,6,6,R,8,Z
        L,5,5,L,5,5,R,8,Z
        L,6,6,L,6,6,L,5,5,R,5,5,Z
        y,Z
        */
        let line1 = "A,A,B,C,B,C,B,A,C,AZ".split('').map(o => toAscii(o));
        let line2 = "R,8,L,12,R,8Z".split('').map(o => toAscii(o));
        let line3 = "L,10,L,10,R,8Z".split('').map(o => toAscii(o));
        let line4 = "L,12,L,12,L,10,R,10Z".split('').map(o => toAscii(o));
        let line5 = "nZ".split('').map(o => toAscii(o));
        stateMachine['moveQueue'] = line1.concat(line2).concat(line3).concat(line4).concat(line5);
        console.log(stateMachine['moveQueue']);
        // console.log(stateMachine['moveQueue']);
        parts[0] = 2;
        intcode_runner(parts, stateMachine);
        
        // Error Code
        console.log(stateMachine['outputs'].map(o => fromAscii(o)).join(''));
        console.log(stateMachine['outputs'][stateMachine['outputs'].length - 1]);
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const toAscii = (char: string) => {
    if (char === 'Z') return 10;
    return char.charCodeAt(0);
}

const fromAscii = (code: number) => {
    return String.fromCharCode(code);
}

// Let intcode pull from off the list
const retrieve = (instructions, destination) => {
    if (!instructions[destination]) return 0;
    return instructions[destination];
}

const intcode_runner = (instructions: number[], stateMachine: object) => {
    try {
        let verbose = false;
        let position = 0;
        let relativeBase = 0;
        let output = 2;
        let input = 2;
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
                if (verbose) console.log("ADD " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                if (verbose) console.log("MULT " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                if (verbose) console.log("INPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest += relativeBase;
                }

                if (stateMachine['moveQueue'].length === 0){
                    console.log("Inputs not expected!");
                    break;
                }
                // Part 2
                input = stateMachine['moveQueue'].shift();
                console.log("Pass Input " + input);
                
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                if (verbose) console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                // console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest = instructions[position + 1] + relativeBase;
                }                
                
                output = instructions[dest];
                
                if (modes[0] && modes[0] == 1){
                    output = dest;
                }
                // Part 2
                // console.log("Output: " + output);
                stateMachine['outputs'].push(output);
                /*
                Part 1
                if (output === 10){
                    stateMachine['currentY'] = stateMachine['currentY'] + 1;
                    stateMachine['currentX'] = 0;
                    stateMachine['view'].push('');
                } else {
                    let current = stateMachine['view'][stateMachine['currentY']];
                    if (output === 35){
                        current += "#";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = "#";
                    } else if (output === 46) {
                        current += ".";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = ".";
                    } else if (output === 94) {
                        current += "^";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = "^";
                    } else if (output === 60) {
                        current += "<";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = "<";
                    } else if (output === 62) {
                        current += ">";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = ">";
                    } else if (output === 118) {
                        current += "v";
                        stateMachine[stateMachine['currentX'] + ',' + stateMachine['currentY']] = "v";
                    } else {
                        console.log("Unexpected Output " + output);
                    }
                    stateMachine['view'][stateMachine['currentY']] = current;
                    stateMachine['currentX'] = stateMachine['currentX']  + 1;
                }
                */

                position += 2;     
            }
            if (op === 5) {
                if (verbose) console.log("JUMP-IF-TRUE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
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
                
                // console.log('eval ' + arg1 + ' ' + (arg1 > 0) + ': go to ' + arg2);
                if (arg1 > 0)
                    position = arg2;
                else 
                    position += 3;
            }
            if (op === 6) {
                if (verbose) console.log("JUMP-IF-FALSE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
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
                
                // console.log('eval ' + arg1 + ' ' + (arg1 === 0) + ': go to ' + arg2);
                if (arg1 === 0)
                    position = arg2;
                else 
                    position += 3;
            }
            if (op === 7) {
                if (verbose) console.log("LESS-THAN " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                if (verbose) console.log("EQUALS " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                
                // console.log('eval ' + arg1 + ' and ' + arg2 + ' ' + (arg1 === arg2) + ': set ' + dest);
                if (arg1 === arg2)
                    instructions[dest] = 1;
                else 
                    instructions[dest] = 0;
                position += 4;
            }
            if (op === 9) {
                if (verbose) console.log("UPDATE RELATIVE_BASE " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
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
                position += 2;     
            }
        }
        return [output, instructions];
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();



