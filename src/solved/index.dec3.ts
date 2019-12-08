"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_3_pt1());
};

module.exports = {
    start
};


const solve_dec_3_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec3.txt', 'utf8');
        const lines = data.split('\n');
        const wire1 = lines[0].split(',');
        const wire2 = lines[1].split(',');
        let xPos = 0;
        let yPos = 0;
        let steps = 0;
        let graph = {};
        graph["0,0"] = {"symbol": "O", "dist": 0, steps: {"1": 0, "2": 0}};
        console.log(wire1);
        console.log(wire2);
        for(const move of wire1){
            const dir = move.charAt(0).toUpperCase();
            const dist = parseInt(move.substr(1));
            for(let i = 0; i < dist; i++){
                if (dir === 'U'){
                    yPos -=1;
                } else if (dir === 'D'){
                    yPos += 1;
                } else if (dir === 'L'){
                    xPos -= 1;
                } else if (dir === 'R'){
                    xPos += 1;
                }
                steps += 1;
                setPos("1",xPos + "," + yPos,graph, steps);
            }
        }
        xPos = 0;
        yPos = 0;
        steps = 0;
        for(const move of wire2){
            const dir = move.charAt(0).toUpperCase();
            const dist = parseInt(move.substr(1));
            for(let i = 0; i < dist; i++){
                if (dir === 'U'){
                    yPos -=1;
                } else if (dir === 'D'){
                    yPos += 1;
                } else if (dir === 'L'){
                    xPos -= 1;
                } else if (dir === 'R'){
                    xPos += 1;
                }
                steps += 1;
                setPos("2",xPos + "," + yPos,graph, steps);
            }
        }
        /* Part 1
        let minDist = 9999999999999;
        for(let point of Object.keys(graph)) {
            if (graph[point].symbol !== 'X')
                continue;
            if (graph[point].distance < minDist){
                minDist = graph[point].distance;
                console.log("New Closest: " + point + " at " + minDist);
            }
        }
        return minDist;
        */
        let minSteps = 9999999999999;
        for(let point of Object.keys(graph)) {
            if (graph[point].symbol !== 'X')
                continue;
            const sumSteps = graph[point].steps["1"] + graph[point].steps["2"];
            if (sumSteps < minSteps){
                minSteps = sumSteps;
                console.log("New Closest: " + point + " at " + minSteps);
            }
       }
       return minSteps;
       
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const setPos = (wire: string, position: string, graph: object, steps: number) => {
    const points = position.split(',').map(numStr => parseInt(numStr));
    const calcDist = Math.abs(points[0]) + Math.abs(points[1]);
    if (!graph[position]){
        graph[position] = {symbol: wire, distance: calcDist}; 
        if (!graph[position].steps){
            graph[position].steps = {};
            graph[position].steps[wire] = steps;
        }
        return;
    } 
    if (graph[position].symbol === wire)
        return;
    graph[position].symbol = 'X';
    if (!graph[position].steps){
        graph[position].steps = {};
    }
    graph[position].steps[wire] = steps;
}




start();



