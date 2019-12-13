"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_12_pt1());
    console.log(solve_dec_12_pt2());
};

module.exports = {
    start
};


const solve_dec_12_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec4.txt', 'utf8');
        const lines = data.split('\n');

        let moonHolder = {};
        let repeatingSpots = new Set();
        let moon1 = {xPos: 1, yPos: 4, zPos: 4, xVel: 0, yVel: 0, zVel: 0};
        let moon2 = {xPos: -4, yPos: -1, zPos: 19, xVel: 0, yVel: 0, zVel: 0};
        let moon3 = {xPos: -15, yPos: -14, zPos: 12, xVel: 0, yVel: 0, zVel: 0};
        let moon4 = {xPos: -17, yPos: 1, zPos: 10, xVel: 0, yVel: 0, zVel: 0};

        // Moon 1
        for(let i = 0; i < 1000; i++){
            // 1,2
            updateMoonVelocity(moon1, moon2);
            // 1,3
            updateMoonVelocity(moon1, moon3);    
            // 1,4
            updateMoonVelocity(moon1, moon4);
            // 2,3
            updateMoonVelocity(moon2, moon3);
            // 2,4
            updateMoonVelocity(moon2, moon4);
            // 3,4
            updateMoonVelocity(moon3, moon4);
            
            moveMoon(moon1);
            moveMoon(moon2);
            moveMoon(moon3);
            moveMoon(moon4);
        }

        let moon1Energy = 
            (Math.abs(moon1.xPos) + Math.abs(moon1.yPos) + Math.abs(moon1.zPos)) * 
            (Math.abs(moon1.xVel) + Math.abs(moon1.yVel) + Math.abs(moon1.zVel));
        let moon2Energy = 
            (Math.abs(moon2.xPos) + Math.abs(moon2.yPos) + Math.abs(moon2.zPos)) * 
            (Math.abs(moon2.xVel) + Math.abs(moon2.yVel) + Math.abs(moon2.zVel));
        let moon3Energy = 
            (Math.abs(moon3.xPos) + Math.abs(moon3.yPos) + Math.abs(moon3.zPos)) * 
            (Math.abs(moon3.xVel) + Math.abs(moon3.yVel) + Math.abs(moon3.zVel));
        let moon4Energy = 
            (Math.abs(moon4.xPos) + Math.abs(moon4.yPos) + Math.abs(moon4.zPos)) * 
            (Math.abs(moon4.xVel) + Math.abs(moon4.yVel) + Math.abs(moon4.zVel));
        console.log(moon1Energy + "," + moon2Energy + "," + moon3Energy + "," + moon4Energy);
        console.log(moon1Energy + moon2Energy + moon3Energy + moon4Energy);
        
        return moon1Energy + moon2Energy + moon3Energy + moon4Energy;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const updateMoonVelocity = (moon1, moon2) => {
    if (moon1.xPos < moon2.xPos) {
        moon1.xVel += 1;
        moon2.xVel -= 1;
    }
    if (moon1.xPos > moon2.xPos) {
        moon1.xVel -= 1;
        moon2.xVel += 1;
    }
    if (moon1.yPos < moon2.yPos) {
        moon1.yVel += 1;
        moon2.yVel -= 1;
    }
    if (moon1.yPos > moon2.yPos) {
        moon1.yVel -= 1;
        moon2.yVel += 1;
    }
    if (moon1.zPos < moon2.zPos) {
        moon1.zVel += 1;
        moon2.zVel -= 1;
    }
    if (moon1.zPos > moon2.zPos) {
        moon1.zVel -= 1;
        moon2.zVel += 1;
    }
}

const moveMoon = (moon) => {
    moon.xPos += moon.xVel;
    moon.yPos += moon.yVel;
    moon.zPos += moon.zVel;
}

const solve_dec_12_pt2 = () => {
    let data = fs.readFileSync('src/test.dec4.txt', 'utf8');
    const lines = data.split('\n');

    
    
    // Example 1 - 2,772
    /*
    let moon1 = {xPos: -1, yPos: 0, zPos: 2, xVel: 0, yVel: 0, zVel: 0};   
    let moon2 = {xPos: 2, yPos: -10, zPos: -7, xVel: 0, yVel: 0, zVel: 0}; 
    let moon3 = {xPos: 4, yPos: -8, zPos: 8, xVel: 0, yVel: 0, zVel: 0};   
    let moon4 = {xPos: 3, yPos: 5, zPos: -1, xVel: 0, yVel: 0, zVel: 0};   
    */
    
    /*
    // Example 2 - 4,686,774,924
   let moon1 = {xPos: -8, yPos: -10, zPos: 0, xVel: 0, yVel: 0, zVel: 0};   
        // -8:2028 -10:5898 0:4702
   let moon2 = {xPos: 5, yPos: 5, zPos: 10, xVel: 0, yVel: 0, zVel: 0};     
        // 5:2028 5:5898 10:4702 --> LCM 4,686,774,924
   let moon3 = {xPos: 2, yPos: -7, zPos: 3, xVel: 0, yVel: 0, zVel: 0};     
        // 2:2028, -7:5898, 3:4702 --> LCM 4,686,774,924
   let moon4 = {xPos: 9, yPos: -8, zPos: -3, xVel: 0, yVel: 0, zVel: 0};  
    */

    
    // Real
    let moon1 = {xPos: 1, yPos: 4, zPos: 4, xVel: 0, yVel: 0, zVel: 0};
    let moon2 = {xPos: -4, yPos: -1, zPos: 19, xVel: 0, yVel: 0, zVel: 0};
    let moon3 = {xPos: -15, yPos: -14, zPos: 12, xVel: 0, yVel: 0, zVel: 0};
    let moon4 = {xPos: -17, yPos: 1, zPos: 10, xVel: 0, yVel: 0, zVel: 0};
    

   let moon1Matched = 0;
   let moon2Matched = 0;
   let moon3Matched = 0;
   let moon4Matched = 0;
   let moon1Test = JSON.stringify(moon1);
   let moon2Test = JSON.stringify(moon2);
   let moon3Test = JSON.stringify(moon3);
   let moon4Test = JSON.stringify(moon4);
   console.log("searching for....");
   console.log(moon1Test);
   console.log(moon2Test);
   console.log(moon3Test);
   console.log(moon4Test);
   

    for(let i = 0; i < 5000000; i++){
        // 1:186028     4:231614      4:108344   --> 583,523,031,727,256
        if (moon1.zPos === 4 && moon1.zVel === 0) { 
            console.log("Phase for Moon 1: " + i);
        }

        // 1,2
        updateMoonVelocity(moon1, moon2);
        // 1,3
        updateMoonVelocity(moon1, moon3);    
        // 1,4
        updateMoonVelocity(moon1, moon4);
        // 2,3
        updateMoonVelocity(moon2, moon3);
        // 2,4
        updateMoonVelocity(moon2, moon4);
        // 3,4
        updateMoonVelocity(moon3, moon4);
        
        moveMoon(moon1);
        moveMoon(moon2);
        moveMoon(moon3);
        moveMoon(moon4);
    }

    console.log("Moon 1 Period: " + moon1Matched);
    console.log("Moon 2 Period: " + moon2Matched);
    console.log("Moon 3 Period: " + moon3Matched);
    console.log("Moon 4 Period: " + moon4Matched);

    return 0;
}

start();



