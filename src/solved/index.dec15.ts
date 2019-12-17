"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_15_pt1());
    console.log(solve_dec_15_pt2());
};

module.exports = {
    start
};

const checkCardinals = [1,2,2,1,3,4,4,3];
        
const solve_dec_15_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec15.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['lastMoveResult'] = 'init';
        stateMachine['moveQueue'] = [].concat(checkCardinals);
        stateMachine['0,0'] = {'symbol': 'O', 'path': '', 'mapped': true};
        stateMachine['position'] = '0,0';
        
        for(let i = 0; i < 1000; i++){
            console.log("@@@@@@@@@@@@@@@@@@@");
            console.log("Checking Depth " + stateMachine['moveQueue'].length)
            intcode_runner(JSON.parse(JSON.stringify(parts)), stateMachine);
            let nextShortestPath = 10000000;
            let nextPath = "";
            let nextKey = "";
            let totalUnexplored = 0;
            for(let key of Object.keys(stateMachine)){
                if (key === 'lastMoveResult' || key === 'moveQueue' || key === 'position' || key === 'lastMove')
                    continue;
                if (stateMachine[key].symbol === 'T'){
                    nextShortestPath = stateMachine[key].path.length;
                    nextPath = stateMachine[key].path;
                    nextKey = key;
                    break;   
                }
                if (stateMachine[key].mapped)
                    continue;
                totalUnexplored += 1;
                if (stateMachine[key].path.length < nextShortestPath){
                    nextShortestPath = stateMachine[key].path.length;
                    nextPath = stateMachine[key].path;
                    nextKey = key;
                    if (stateMachine[key].symbol === 'T') break;
                }
            }
            if (nextKey === "") {
                console.log("Hit a dead end at i=" + i + "!");
                break;
            }
            if (stateMachine[nextKey].symbol === "T") {
                console.log("Found it at i=" + i + "!");
                console.log(stateMachine[nextKey].path);
                console.log(stateMachine[nextKey].path.length);
                break;
            }
            
            console.log("Total Left to Explore: " + totalUnexplored);
            console.log("Next Destination: " + nextKey + " at depth " + nextPath.length);
            stateMachine[nextKey].mapped = true;
            stateMachine['lastMoveResult'] = 'init';
            stateMachine['position'] = '0,0';
            stateMachine['moveQueue'] = nextPath.split('').map(numStr => parseInt(numStr)).concat(checkCardinals);
            drawMap(stateMachine, nextKey);
        }

            
        drawMap(stateMachine, '0,0');
        for(let key of Object.keys(stateMachine)){
            if (key === 'lastMoveResult' || key === 'moveQueue' || key === 'position' || key === 'lastMove')
                continue;
            if (stateMachine[key].mapped)
                continue;
            console.log("Explore " + key);
        }
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const drawMap = (stateMachine, nextKey="fake") => {
    const aperture = 25;
    for(let y = -aperture; y <= aperture; y++){
        let line = '';
        for(let x = -aperture; x <= aperture; x++){
            if ((x + ',' + y) === nextKey){
                line += 'R';
                continue;
            }
            if (!stateMachine[x+','+y])
                line += ' ';
            else
                line += stateMachine[x+','+y].symbol;
        }
        console.log(line);
    }
}

const solve_dec_15_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec15.txt', 'utf8');
        const parts = data.split(',').map(numStr => parseInt(numStr));
        let stateMachine = {};
        stateMachine['lastMoveResult'] = 'init';
        stateMachine['moveQueue'] = [].concat(checkCardinals);
        stateMachine['0,0'] = {'symbol': '.', 'path': '', 'mapped': true};
        stateMachine['position'] = '0,0';
        
        for(let i = 0; i < 1000; i++){
            console.log("@@@@@@@@@@@@@@@@@@@");
            console.log("Checking Depth " + stateMachine['moveQueue'].length)
            intcode_runner(JSON.parse(JSON.stringify(parts)), stateMachine);
            let nextShortestPath = 10000000;
            let nextPath = "";
            let nextKey = "";
            let totalUnexplored = 0;
            for(let key of Object.keys(stateMachine)){
                if (key === 'lastMoveResult' || key === 'moveQueue' || key === 'position' || key === 'lastMove')
                    continue;
                if (stateMachine[key].mapped)
                    continue;
                totalUnexplored += 1;
                if (stateMachine[key].path.length < nextShortestPath){
                    nextShortestPath = stateMachine[key].path.length;
                    nextPath = stateMachine[key].path;
                    nextKey = key;
                    if (stateMachine[key].symbol === 'T') break;
                }
            }
            if (nextKey === "") {
                console.log("Hit a dead end at i=" + i + "!");
                break;
            }
            
            console.log("Total Left to Explore: " + totalUnexplored);
            console.log("Next Destination: " + nextKey + " at depth " + nextPath.length);
            stateMachine[nextKey].mapped = true;
            stateMachine['lastMoveResult'] = 'init';
            stateMachine['position'] = '0,0';
            stateMachine['moveQueue'] = nextPath.split('').map(numStr => parseInt(numStr)).concat(checkCardinals);
            // drawMap(stateMachine, nextKey);
        }

            
        let oxygenated = false;
        let toFill = 0;
        let time = 0;
        while (!oxygenated){
            let stateMachineCopy = JSON.parse(JSON.stringify(stateMachine));
            for(let key of Object.keys(stateMachine)){
                oxygenated = true;
                if (key === 'lastMoveResult' || key === 'moveQueue' || key === 'position' || key === 'lastMove')
                    continue;
                if (stateMachine[key].symbol === '.'){
                    toFill += 1;
                    oxygenated = false;
                }
                if (stateMachine[key].symbol !== 'O')
                    continue;
                const north = getMove(1, key);
                const south = getMove(2, key);
                const west = getMove(3, key);
                const east = getMove(4, key);
                if (stateMachine[north] && stateMachine[north].symbol === '.')
                    stateMachineCopy[north].symbol = 'O';
                if (stateMachine[south] && stateMachine[south].symbol === '.')
                    stateMachineCopy[south].symbol = 'O';
                if (stateMachine[east] && stateMachine[east].symbol === '.')
                    stateMachineCopy[east].symbol = 'O';
                if (stateMachine[west] && stateMachine[west].symbol === '.')
                    stateMachineCopy[west].symbol = 'O';
            }
            time += 1;
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            drawMap(stateMachineCopy);
            stateMachine = stateMachineCopy;
            console.log("Time: " + time + ', ' + toFill + ' left to go before this round'); // 377 too high
            toFill = 0;
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        }
        return 0;
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

const getMove = (direction, position) => {
    // 1 = N, 2 = S, 3 = W, 4 = E
    let coords = position.split(',').map(numStr => parseInt(numStr));
    if (direction === 1)
        coords[1] -= 1;
    else if (direction === 2)
        coords[1] += 1;
    else if (direction === 3)
        coords[0] -=1;
    else if (direction === 4)
        coords[0] += 1;
    
    return coords[0] + "," + coords[1];
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

                if (stateMachine['moveQueue'].length === 0)
                    break;
                
                
                // 1 = N, 2 = S, 3 = W, 4 = E
                if (stateMachine['lastMoveResult'] === 'init'){
                    input = stateMachine['moveQueue'].shift();
                } else {
                    if (stateMachine['lastMoveResult'] === 0){
                        // Hit a wall -- all moves are paired, skip the next one
                        stateMachine['moveQueue'].shift();
                        
                        const wall = getMove(stateMachine['lastMove'], stateMachine['position']);
                        const path = stateMachine[stateMachine['position']].path + stateMachine['lastMove'];
                        if (!stateMachine[wall])
                            stateMachine[wall] = {'symbol': '#', path, 'mapped': true};
                    } else if (stateMachine['lastMoveResult'] === 1){
                        // Moved
                        const space = getMove(stateMachine['lastMove'], stateMachine['position']);
                        const path = stateMachine[stateMachine['position']].path + stateMachine['lastMove'];
                        if (!stateMachine[space]){
                            stateMachine[space] = {'symbol': '.', path, 'mapped': false};
                        }

                        stateMachine['position'] = space;
                    } else if (stateMachine['lastMoveResult'] === 2){
                        // Found the oxygen tank
                        const tank = getMove(stateMachine['lastMove'], stateMachine['position']);
                        const path = stateMachine[stateMachine['position']].path + stateMachine['lastMove'];
                        // Part 1 had slightly different goals
                        // if (!stateMachine[tank])
                        //    stateMachine[tank] = {'symbol': 'T', path, 'mapped': true};
                        if (!stateMachine[tank])
                            stateMachine[tank] = {'symbol': 'O', path, 'mapped': false};
                        stateMachine['position'] = tank;
                    }

                    if (stateMachine['moveQueue'].length === 0){
                        break;
                    }
                    input = stateMachine['moveQueue'].shift();
                }
                stateMachine['lastMove'] = input;
                
                /*
                if (input === 1)
                    console.log("Read input " + input + " NORTH");
                if (input === 2)
                    console.log("Read input " + input + " SOUTH");
                if (input === 3)
                    console.log("Read input " + input + " WEST");
                if (input === 4)
                    console.log("Read input " + input + " EAST");
                */

                instructions[dest] = input;
                position += 2;     
            }
            if (op === 4) {
                if (verbose) console.log("OUTPUT " + position + "|" + instructions[position] + "|" + instructions[position + 1]);
                let dest = instructions[position+1];
                if (modes[0] && modes[0] === 2){
                    dest = instructions[position + 1] + relativeBase;
                }                
                
                output = instructions[dest];
                
                if (modes[0] && modes[0] == 1){
                    output = dest;
                }

                stateMachine['lastMoveResult'] = output;
                
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



