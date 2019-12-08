"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // solve_dec_1_pt1(); //3506577
    console.log(solve_dec_1_pt2());
    // 5256960  
};

module.exports = {
    start
};


const solve_dec_1_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec1.txt', 'utf8');
        const lines = data.split('\n');

        let totalMass = 0;
        for(let line of lines){
            console.log(line);
            let mass =  Math.floor((parseInt(line) / 3)) - 2;
            console.log(mass);
            totalMass += mass;
        }
        console.log(totalMass);
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_1_pt2 = () => {
    let data = fs.readFileSync('src/test.dec1.txt', 'utf8');
    const lines = data.split('\n');
    let totalMass = 0;
    for(let line of lines){
        let fuelMass = calcFuel(parseInt(line));
        console.log(line + " : " + fuelMass);
        totalMass += fuelMass;
    }
    return totalMass;
}
const calcFuel = (input: number): number => {
    let mass = Math.floor((input / 3)) - 2;
    if (mass > 0)
        return mass + calcFuel(mass);
    return 0;
}



start();



