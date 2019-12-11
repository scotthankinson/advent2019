"use strict";
// tslint:disable
import fs = require('fs');
import Fraction from 'fraction.js';

const start = (): void => {
    // console.log(solve_dec_10_pt1());
    console.log(solve_dec_10_pt2());
    // 1609 Too High
    // 604!
};

module.exports = {
    start
};


const solve_dec_10_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');
        
        let map  = {};
        for(let i = 0; i < lines.length; i++){
            // console.log(lines[i]);
            let points = lines[i].split('');
            for(let j = 0; j < points.length; j++){
                map[j + ',' + i] = {'symbol': points[j], xPos: j, yPos: i, visible: 0}
                map['maxWidth'] = j;
            }
            map['maxHeight'] = i;
        }

        
        let maxVisible = 0;
        let maxAsteroid = map['0,0'];
        for(let y = 0; y <= map["maxHeight"]; y++) {
            for(let x = 0; x <= map["maxWidth"]; x++) {
                let result = mapAsteroid(map[x +',' + y], map);
                if (!result) continue;
                let visibleCount = 0;
                for(let subY = 0; subY <= result.maxHeight; subY++) {
                    let line = "";
                    for(let subX = 0; subX <= result.maxWidth; subX++) {
                        line += result[subX + ',' + subY].symbol;
                        if (result[subX + ',' + subY].symbol === 'V') visibleCount += 1;
                    }
                    console.log(line);
                }
                console.log(x + ',' + y + " sees " + visibleCount);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                map[x + ',' + y].visible = visibleCount;
                if (visibleCount > maxVisible){
                    maxVisible = visibleCount;
                    maxAsteroid = map[x + ',' + y];
                }
            }
        }
        
        return maxAsteroid;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
 
const mapAsteroid = (asteroid, map) => { 
    if (asteroid.symbol !== '#') return;
    let mapCopy = JSON.parse(JSON.stringify(map));
    
    // Divide By Zeroes
    markAsteroid(asteroid, "1/0", mapCopy);
    markAsteroid(asteroid, "-1/0", mapCopy);

    for(let y = 0; y <= mapCopy.maxHeight; y++) {
        for(let x = 0; x <= mapCopy.maxWidth; x++) {
            if (asteroid.xPos === x && asteroid.yPos === y)
                continue;
            if (mapCopy[x + ',' + y].symbol !== '#')
                continue;

            let xDist = mapCopy[x + ',' + y].xPos - asteroid.xPos;
            let yDist = mapCopy[x + ',' + y].yPos - asteroid.yPos;
            if (yDist === 0) continue;
            
            let slope = new Fraction(Math.abs(xDist), Math.abs(yDist)).simplify();
            let signedSlope = slope.toFraction();
            if (signedSlope.indexOf("/") === -1)
                signedSlope += "/1";
            if (xDist < 0) signedSlope = "-" + signedSlope;
            if (yDist < 0) signedSlope = signedSlope.replace("/", "/-");
    
            // console.log(asteroid.xPos + ',' + asteroid.yPos + ' to ' + x + ',' + y);
            // console.log(signedSlope);
            
            markAsteroid(asteroid, signedSlope, mapCopy);
        }
    }
    
    return mapCopy;
}

const markAsteroid = (asteroid, direction: string, map) => {
    const xSlope = parseInt(direction.split('/')[0]);
    const ySlope = parseInt(direction.split('/')[1]);
    let xPos = asteroid.xPos + xSlope;
    let yPos = asteroid.yPos + ySlope;
    let foundOne = false;
    while (xPos >= 0 && xPos <= map.maxWidth && yPos >= 0 && yPos <= map.maxHeight){
        if (map[xPos + ',' + yPos].symbol === '#' && !foundOne){
            foundOne = true;
            map[xPos + ',' + yPos].symbol = 'V';
        } else if (map[xPos + ',' + yPos].symbol === '#'){
            map[xPos + ',' + yPos].symbol = 'v';
        }
        xPos += xSlope;
        yPos += ySlope;
    }   
}

const solve_dec_10_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec10.txt', 'utf8');
        const lines = data.split('\n');

        let map  = {};
        for(let i = 0; i < lines.length; i++){
            console.log(lines[i]);
            let points = lines[i].split('');
            for(let j = 0; j < points.length; j++){
                map[j + ',' + i] = {'symbol': points[j], xPos: j, yPos: i, visible: 0}
                map['maxWidth'] = j;
            }
            map['maxHeight'] = i;
        }
        console.log("~~~~~~~~~~~~~~~~~");

        let centerAsteroid = map["11,13"];
        let visualized = mapAsteroid(centerAsteroid, map);
        let countBlasted = 0;
        let lastBlasted;
        do {
            visualized = mapAsteroid(centerAsteroid, visualized);

            let visible = 0;
            for(let i = 0; i < lines.length; i++){
                let points = lines[i].split('');
                let line = "";
                let angles = [];
                for(let j = 0; j < points.length; j++){
                    line += visualized[j + ',' + i].symbol;
                    if (visualized[j + ',' + i].symbol === 'V') {
                        visible += 1;
                        const yDelta = (visualized[j + ',' + i].yPos - centerAsteroid.yPos);   
                        const xDelta = visualized[j + ',' + i].xPos - centerAsteroid.xPos;     
                        let angle = (Math.atan2(yDelta, xDelta) * 180/Math.PI);
                        // Rotate to make our math easy (90 ==> 0)
                        angle = (angle + 450) % 360;
                        visualized[j + ',' + i].angle = angle;
                        angles.push(angle);
                    } else if (visualized[j + ',' + i].symbol === 'v'){
                        // reset for next pass
                        visualized[j + ',' + i].symbol = '#';
                    }
                }
                console.log(line + "   " + angles);
            }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            
            visualized['visible'] = visible;
            let visibleAsteroids = [];
        

            for(let point of Object.keys(visualized)){
                if (!visualized[point].symbol || visualized[point].symbol !== 'V')
                    continue;
                visibleAsteroids.push(visualized[point]);
            }
            visibleAsteroids = visibleAsteroids.sort((a,b) => {
                if (visualized[a.xPos + ',' + a.yPos].angle > visualized[b.xPos + ',' + b.yPos].angle) return 1;
                if (visualized[a.xPos + ',' + a.yPos].angle < visualized[b.xPos + ',' + b.yPos].angle) return -1;
                return 0;
            });

            // console.log(visibleAsteroids);
            for (let i = 0; i < visibleAsteroids.length; i++){
                visualized[visibleAsteroids[i].xPos + ',' + visibleAsteroids[i].yPos].symbol = '.';
                lastBlasted = visualized[visibleAsteroids[i].xPos + ',' + visibleAsteroids[i].yPos]
                countBlasted += 1;
                console.log(countBlasted + ": " + lastBlasted.xPos + ',' + lastBlasted.yPos + ', ' + lastBlasted.angle + '`' + ' , (' + (lastBlasted.xPos - centerAsteroid.xPos) + ',' + (lastBlasted.yPos - centerAsteroid.yPos) + ')');
            }
        } while(visualized['visible'] !== 0);

        return countBlasted;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



