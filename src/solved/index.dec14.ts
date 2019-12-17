"use strict";
// tslint:disable
import fs = require('fs');

const start = (): void => {
    // console.log(solve_dec_14_pt1());
    console.log(solve_dec_14_pt2());
};

module.exports = {
    start
};


const solve_dec_14_pt1 = () => {
    try {
        let data = fs.readFileSync('src/test.dec14.txt', 'utf8');
        const lines = data.split('\n');
        let outputs = {};
        for(let i = 0; i < lines.length; i++){
            let recipes = lines[i].split(' => ');
            let inputParts = recipes[0].split(',').map((value) => {
                let oneInputParts = value.trim().split(' ');
                return {'chemical': oneInputParts[1], 'quantity': parseInt(oneInputParts[0])};
            });

            let outputParts = recipes[1].split(' ');
            outputs[outputParts[1]] = {'chemYield': parseInt(outputParts[0]), inputs: inputParts};
        }

        let stackOfRawMaterials = [{'chemical': "FUEL", 'quantity': 1}];
        while (stackOfRawMaterials.length > 0){
            const filtered = stackOfRawMaterials.filter(o => o.chemical === 'ORE' || o.quantity > 0);
            if (filtered.length === 1 && filtered[0].chemical === "ORE")
                break;
            if (stackOfRawMaterials.length > 1 && stackOfRawMaterials[0].chemical === "ORE"){
                let ore = stackOfRawMaterials.shift();
                stackOfRawMaterials.push(ore);
                continue;
            }
            if (stackOfRawMaterials.length > 1 && stackOfRawMaterials[0].quantity < 0){
                let ore = stackOfRawMaterials.shift();
                stackOfRawMaterials.push(ore);
                continue;
            }
            let first = stackOfRawMaterials.shift();
            console.log('Processing Equation for ==> ' + JSON.stringify(first));
            let quantity = first.quantity
            while (quantity > 0){
                stackOfRawMaterials = stackOfRawMaterials.concat(outputs[first.chemical].inputs);
                quantity -= outputs[first.chemical].chemYield
                if (quantity < 0){
                    stackOfRawMaterials.push({'chemical': first.chemical, 'quantity': quantity});
                }
            }
            stackOfRawMaterials = reduceEquations(stackOfRawMaterials);
            console.log(JSON.stringify(stackOfRawMaterials));
        }
        
        // console.log(JSON.stringify(outputs));

        return stackOfRawMaterials.filter(o => o.chemical === 'ORE' || o.quantity > 0)[0].quantity;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

// TODO: Peanut-butter spread excess leftovers?
const reduceEquations = (inputs) => {
    // Combine all like elements in the array
    let combo = {};
    for(let i = 0; i < inputs.length; i++){
        if (!combo[inputs[i].chemical]){
            combo[inputs[i].chemical] = inputs[i].quantity;
        } else  {
            combo[inputs[i].chemical] += inputs[i].quantity;
        }
    }
    let result = [];
    for(let key of Object.keys(combo)){

        result.push({'chemical': key, 'quantity': combo[key]});
    }
    return result;
}


const solve_dec_14_pt2 = () => {
    try {
        let data = fs.readFileSync('src/test.dec14.txt', 'utf8');
        const lines = data.split('\n');
        let outputs = {};
        for(let i = 0; i < lines.length; i++){
            let recipes = lines[i].split(' => ');
            let inputParts = recipes[0].split(',').map((value) => {
                let oneInputParts = value.trim().split(' ');
                return {'chemical': oneInputParts[1], 'quantity': parseInt(oneInputParts[0])};
            });

            let outputParts = recipes[1].split(' ');
            outputs[outputParts[1]] = {'chemYield': parseInt(outputParts[0]), inputs: inputParts};
        }

        let stackOfRawMaterials = [];
        let remainingOre = 1000000000000;
        let currentOre = 0;
        let currentFuel = 0;
        while((remainingOre - currentOre) > 0){
            stackOfRawMaterials.unshift({'chemical': "FUEL", 'quantity': 1});
            currentFuel += 1;
            while (stackOfRawMaterials.length > 0){
                const filtered = stackOfRawMaterials.filter(o => o.chemical === 'ORE' || o.quantity > 0);
                if (filtered.length === 1 && filtered[0].chemical === "ORE")
                    break;
                if (stackOfRawMaterials.length > 1 && stackOfRawMaterials[0].chemical === "ORE"){
                    let ore = stackOfRawMaterials.shift();
                    stackOfRawMaterials.push(ore);
                    continue;
                }
                if (stackOfRawMaterials.length > 1 && stackOfRawMaterials[0].quantity < 0){
                    let ore = stackOfRawMaterials.shift();
                    stackOfRawMaterials.push(ore);
                    continue;
                }
                let first = stackOfRawMaterials.shift();
                // console.log('Processing Equation for ==> ' + JSON.stringify(first));
                let quantity = first.quantity
                while (quantity > 0){
                    stackOfRawMaterials = stackOfRawMaterials.concat(outputs[first.chemical].inputs);
                    quantity -= outputs[first.chemical].chemYield
                    if (quantity < 0){
                        stackOfRawMaterials.push({'chemical': first.chemical, 'quantity': quantity});
                    }
                }
                stackOfRawMaterials = reduceEquations(stackOfRawMaterials);
                // console.log(JSON.stringify(stackOfRawMaterials));
            }
            if (currentOre === 0){
                // Minimum 452338
                for(let i = 0; i < stackOfRawMaterials.length; i++){
                    stackOfRawMaterials[i].quantity *= 452338;
                    currentFuel = 452338;
                }
            }
            currentOre = stackOfRawMaterials.filter(o => o.chemical === 'ORE' || o.quantity > 0)[0].quantity;
            console.log(currentFuel + ': ' + currentOre);
        }
        console.log(stackOfRawMaterials);
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();



