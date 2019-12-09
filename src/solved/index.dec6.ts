"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_6_pt1());
    console.log(solve_dec_6_pt2());
    // 54 incorrect
};

module.exports = {
    start
};


const solve_dec_6_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec6.txt', 'utf8');
        const lines = data.split('\n');
        let orbits = {};
        let bodies = {};
        for(let line of lines){
            let notation = line.split(')');
            bodies[notation[0]] = -1;
            bodies[notation[1]] = -1;
            if (!orbits[notation[0]]){
                orbits[notation[0]] = [];
                orbits[notation[0]] = [notation[1]];
            } else {
                orbits[notation[0]].push(notation[1]);
            }
        }
        for(let i = 0; i < lines.length; i++){
            setOrbits(orbits, bodies, i);
        }

        let sum = 0;
        for(let body of Object.keys(bodies)){
            sum += bodies[body];
        }

        return sum;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const setOrbits = (orbits: object, bodies: object, depth: number) => {    
    if (depth === 0){
        bodies['COM'] = 0;
        return;
    }
    let previousDepth = depth - 1;
    let previousBodies = [];
    for(let body of Object.keys(bodies)) {
        if (bodies[body] === previousDepth)
            previousBodies.push(body)
    }
    let currentBodies = [];
    for(let body of previousBodies){
        currentBodies = currentBodies.concat(orbits[body]);
    }
    for(let body of currentBodies){
        if (body !== undefined)
            bodies[body] = depth;
    }
}


const solve_dec_6_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec6.txt', 'utf8');
        const lines = data.split('\n');
        let orbits = {};
        let bodies = {};
        for(let line of lines){
            let notation = line.split(')');
            bodies[notation[0]] = -1;
            bodies[notation[1]] = -1;
            if (!orbits[notation[0]]){
                orbits[notation[0]] = [];
                orbits[notation[0]] = [notation[1]];
            } else {
                orbits[notation[0]].push(notation[1]);
            }
        }
        for(let i = 0; i < lines.length; i++){
            setOrbits(orbits, bodies, i);
        }

        let sum = 0;
        for(let body of Object.keys(bodies)){
            sum += bodies[body];
        }

        let youDepth = bodies['YOU'];
        let sanDepth = bodies['SAN'];
        let youParent = getParent('YOU', orbits);
        let sanParent = getParent('SAN', orbits);
        while(youParent !== sanParent){    
            if (youDepth >= sanDepth){
                youParent = getParent(youParent, orbits);
                youDepth -=1;
            } else {
                sanParent = getParent(sanParent, orbits);
                sanDepth -=1;
            }
        }

        return (bodies['YOU'] - youDepth) + (bodies['SAN'] - sanDepth);
        
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getParent = (leaf: string, orbits: object) => {
    for(let orbit of Object.keys(orbits)){
        if (orbits[orbit].indexOf(leaf) > -1){
            return orbit;
        }
    }
}



start();



