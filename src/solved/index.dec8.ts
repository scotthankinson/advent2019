"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_8_pt1());
    console.log(solve_dec_8_pt2());
};

module.exports = {
    start
};


const solve_dec_8_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const colors = data.split('');

        const maxW = 25;
        const maxH = 6;
        let currentW = 0;
        let currentH = 0;
        let currentLayer = 0;
        let layers = [[]];
        let line = "";
        while(1 === 1)
        {
            const color = colors.shift();
            line = line + "" + color;
            currentW += 1;
            if (currentW === maxW){
                layers[currentLayer].push(line);
                
                line = "";
                currentW = 0;
                currentH += 1;
            }
            if (colors.length === 0) break;
            if (currentH === maxH){
                layers.push([]);
                currentLayer += 1;
                currentW = 0;
                currentH = 0;
                line = "";
            }
        }

        let digitCounts = {};
        for(let i = 0; i < layers.length; i++){
            for(let digit = 0; digit < 10; digit++){
                let count = 0;
                for (let row of layers[i]){
                    const colors = row.split('').map(numStr => parseInt(numStr));
                    let zeroes = colors.filter(o => o === digit).length;
                    count += zeroes;
                }
                digitCounts[i + "_" + digit] = count;
            }
        }

        let minCount = 150;
        let minLayer = 1000;
        for (let count of Object.keys(digitCounts)){
            console.log(count + ": " + digitCounts[count]);
            const parts = count.split('_');
            if (parts[1] !== '0') continue;
            if (digitCounts[count] < minCount){
                minCount = digitCounts[count];
                minLayer = parseInt(parts[0]);
            }
        }

        console.log(minLayer + ": " + minCount);
        // Layer 5 - 15 x 131 = 1965   
        
        return -1;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_dec_8_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec8.txt', 'utf8');
        const colors = data.split('');

        const maxW = 25;
        const maxH = 6;
        let currentW = 0;
        let currentH = 0;
        let currentLayer = 0;
        let layers = [[]];
        let line = "";
        while(1 === 1)
        {
            const color = colors.shift();
            line = line + "" + color;
            currentW += 1;
            if (currentW === maxW){
                layers[currentLayer].push(line);
                
                line = "";
                currentW = 0;
                currentH += 1;
            }
            if (colors.length === 0) break;
            if (currentH === maxH){
                layers.push([]);
                currentLayer += 1;
                currentW = 0;
                currentH = 0;
                line = "";
            }
        }

        console.log(layers);
        let render = "";
        // For each pixel work down until you find a blocking one
        for(let col = 0; col < maxH; col++){
            for(let row = 0; row < maxW; row++){
                for(let i = 0; i < layers.length; i++){
                    const char = layers[i][col].charAt(row);
                    console.log(char);
                    if (i === layers.length - 1 && char === '2')
                        render += '2';
                    if (char === '2') continue;
                    
                    render += char;
                    break;
                }
            }
        }
        console.log(render);
        // Rechunk and zoom waaaaaay out --> GZKJY
        return -1;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



