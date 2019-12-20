"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    console.log(solve_dec_20_pt1());
    // console.log(solve_dec_20_pt2());
};

module.exports = {
    start
};


const solve_dec_20_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec20.txt', 'utf8');
        const lines = data.split('\n');
        let mapCoords = {};
        for(let y = 0; y < lines.length; y++){
            for (let x = 0; x < lines[y].length; x++){
                let checkChar = lines[y].charAt(x);
                if (checkChar === ' ' || checkChar === '#' || checkChar === '.' )
                    continue;   
                if (mapCoords[checkChar])
                    mapCoords[checkChar].positions.push(x + ',' + y);
                else
                    mapCoords[checkChar] = { 'positions' : [x + ',' + y]};
            }
        }
        console.log(mapCoords);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_20_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec20.txt', 'utf8');
        const lines = data.split('\n');

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



