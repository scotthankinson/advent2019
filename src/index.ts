"use strict";
// tslint:disable
import fs = require('fs');
import { strictEqual } from 'assert';
import { stringify } from 'querystring';

const start = (): void => {
    // console.log(solve_dec_13_pt1());
    console.log(solve_dec_13_pt2());
};

module.exports = {
    start
};


const solve_dec_13_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['outCount'] = 0;
        
        intcode_runner(parts, stateMachine);
        console.log(stateMachine);
        let blockCount = 0;
        for(let key of Object.keys(stateMachine)) {
            if (key === 'outCount' || key === 'nextX' || key === 'nextY') continue;
            if (stateMachine[key] === 2) blockCount +=1;
        }
        return blockCount;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_13_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec13.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['outCount'] = 0;
        parts[0] = 2;  // Quarters!
        intcode_runner(parts, stateMachine);
        
        drawBoard(stateMachine);
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

                // Whenever input is read, move the joystick towards the ball
                let ballPosition = "";
                let paddlePosition = "";
                for(let key of Object.keys(stateMachine)) {
                    if (key === 'outCount' || key === 'nextX' || key === 'nextY' || key === 'score') continue;
                    if (stateMachine[key] === 3) {
                        paddlePosition = key;
                    }
                    if (stateMachine[key] === 4) {
                        ballPosition = key;
                    }
                }
                let ballCoords = ballPosition.split(',').map(numStr => parseInt(numStr));
                let paddleCoords = paddlePosition.split(',').map(numStr => parseInt(numStr));
                if (paddleCoords[0] < ballCoords[0]){
                    console.log("Joystick RIGHT");
                    input = 1
                }else if (paddleCoords[0] > ballCoords[0]){
                    console.log("Joystick LEFT");
                    input = -1
                }else {
                    console.log("Joystick NEUTRAL");
                    input = 0;
                }
                drawBoard(stateMachine);
                
                
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                if (verbose) console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
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

                if (stateMachine['outCount'] === 0){
                    stateMachine['nextX'] = output;
                    stateMachine['outCount'] +=1;
                } else if (stateMachine['outCount'] === 1){
                    stateMachine['nextY'] = output;
                    stateMachine['outCount'] +=1;
                } else {
                    console.log("@@@@@@ " + stateMachine['nextX'] + ',' + stateMachine['nextY'] + ',' + output);
                    // My score is going in 2703 and not -1 -- problem with one of my intcodes?
                    if (stateMachine['nextX'] === 2703 && stateMachine['nextY'] === 0){
                        stateMachine['score'] = output;
                        console.log("Score currently " + output);
                    } else {
                        stateMachine[stateMachine['nextX'] + ',' + stateMachine['nextY']] = output;
                        console.log('Draw ' + output  + " at " + stateMachine['nextX'] + ',' + stateMachine['nextY']);
                    }
                    stateMachine['outCount'] = 0;
                }
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


const drawBoard = (stateMachine) => {
    // Board is 41x25 with a score display
    for(let y = 0; y <= 24; y++){
        let line = "";
        for (let x = 0; x <= 40; x++){
            if (stateMachine[x + ',' + y])
                line += stateMachine[x + ',' + y];
            else 
                line += ' ';
        }
        console.log(line);
    }
    const pad = "#";
    console.log(pad.padStart(41, pad));
    console.log(pad + ("" + stateMachine['score']).padStart(19, ' ').padEnd(39, ' ') + pad)
    console.log(pad.padStart(41, pad))
    let test = "";
    

}

start();



