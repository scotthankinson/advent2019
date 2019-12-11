"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_11_pt1());
    // console.log(solve_dec_9_pt2());
};

module.exports = {
    start
};

const solve_dec_11_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec11.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        
        let stateMachine = {};
        // part 1 
        // stateMachine['0,0'] = ".";
        stateMachine['0,0'] = "#";
        stateMachine['xPos'] = 0;
        stateMachine['yPos'] = 0;
        stateMachine['outCount'] = 0;
        stateMachine['cursor'] = "^";
        stateMachine['painted'] = new Set<string>();

        intcode_runner(JSON.parse(JSON.stringify(parts)), stateMachine);
        
        // console.log(stateMachine);
        // part 1 
        // return stateMachine['painted'].size; // 2720

        let maxX = 0;
        let maxY = 0;
        let minX = 0;
        let minY = 0;
        for(let key of Object.keys(stateMachine)){
            if (key === 'xPos' || key === 'yPos' || key === 'objectCount' || key === 'cursor' || key === 'painted') continue;
            const xCoord = parseInt(key.split(',')[0]);
            console.log(xCoord);
            if (xCoord > maxX) maxX = xCoord;
            if (xCoord < minX) minX = xCoord;
            const yCoord = parseInt(key.split(',')[1]);
            console.log(yCoord);
            if (yCoord > maxY) maxY = yCoord;
            if (yCoord < minY) minY = yCoord;
        }
        
        for(let y = minY; y <= maxY; y++){
            let line = "";
            for(let x = minX; x<= maxX; x++){
                line += stateMachine[x + ',' + y] ? stateMachine[x + ',' + y] : ".";
            }
            console.log(line);
        }
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
        // console.log(inputs);
        let position = 0;
        let relativeBase = 0;
        let output = stateMachine['0,0'];
        let input = 0;
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
                // console.log("ADD " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                // console.log("MULT " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                // console.log("INPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest += relativeBase;
                }

                // Check current camera for input
                input = stateMachine[stateMachine["xPos"] + ',' + stateMachine["yPos"]] === '.' ? 0 : 1;
                
                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                // console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
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
                    let paint = "#";
                    if (output === 0) paint = ".";
                    if (stateMachine[stateMachine["xPos"] + ',' + stateMachine["yPos"]] !== paint){
                        console.log("PAINT " + paint + " at " + stateMachine["xPos"] + ',' + stateMachine["yPos"]);
                        stateMachine['painted'].add(stateMachine["xPos"] + ',' + stateMachine["yPos"]);
                    }
                    stateMachine[stateMachine["xPos"] + ',' + stateMachine["yPos"]] = paint;
                    stateMachine['outCount'] +=1;
                } else {
                    let direction = "LEFT";
                    if (output === 1) direction = "RIGHT";
                    moveRobot(direction, stateMachine);
                    stateMachine['outCount'] = 0;
                }
                position += 2;     
            }
            if (op === 5) {
                // console.log("JUMP-IF-TRUE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
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
                // console.log("JUMP-IF-FALSE " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|");
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
                // console.log("LESS-THAN " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                // console.log("EQUALS " + position + "|" + instructions[position] + "|" + instructions[position + 1] + "|" + instructions[position + 2] + "|" + instructions[position + 3]);
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
                // console.log("UPDATE RELATIVE_BASE " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
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

const  moveRobot = (direction, stateMachine) => {
    console.log("MOVE " + direction);
    console.log("IN direction: " + stateMachine['cursor']);
    console.log("IN coord: " + stateMachine['xPos'] + ',' + stateMachine['yPos']);
    if (stateMachine['cursor'] === '^'){
        stateMachine['cursor'] = direction === 'LEFT' ? '<' : '>';
    } else if (stateMachine['cursor'] === '>'){
        stateMachine['cursor'] = direction === 'LEFT' ? '^' : 'v';
    } else if (stateMachine['cursor'] === '<'){
        stateMachine['cursor'] = direction === 'LEFT' ? 'v' : '^';
    } else if (stateMachine['cursor'] === 'v'){
        stateMachine['cursor'] = direction === 'LEFT' ? '>' : '<';
    }
    if (stateMachine['cursor'] === '<'){
        stateMachine['xPos'] -= 1;
    }
    if (stateMachine['cursor'] === '>'){
        stateMachine['xPos'] += 1;
    }
    if (stateMachine['cursor'] === '^'){
        stateMachine['yPos'] -= 1;
    }
    if (stateMachine['cursor'] === 'v'){
        stateMachine['yPos'] += 1;
    }
    console.log("OUT coord: " + stateMachine['xPos'] + ',' + stateMachine['yPos']);
    console.log("OUT direction: " + stateMachine['cursor']);
    if (!stateMachine[stateMachine['xPos'] + ',' + stateMachine['yPos']])
        stateMachine[stateMachine['xPos'] + ',' + stateMachine['yPos']] = '.';
}

start();

