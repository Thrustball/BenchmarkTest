// function consoleTest() {
//     console.log("Hello from sudoku.js");
// }

// function generatePlayfield(divName, size) {
//     let outputHTML = "";
//     for(let y = 0; y < size; y++) {
//         for(let x = 0; x < size; x++) {
//             let id = y*size+x;
//             outputHTML += `<input type="number" id="${id}" size="2" value="0">`;
//         }
//         outputHTML += "<br>"
//     }
//     $(`#${divName}`).html(outputHTML);
// }

class Sudoku {
    playFieldHTML = "";
    playFieldValues = [];
    allSolutions = [];

    constructor(divName, size) {
      this.divName = divName;
      this.size = size;
      this.maxSize = size*size;
    }

    consoleTest() {
        console.log("Hello from sudoku.js");
    }

    generatePlayfield() {
        let outputHTML = "";
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++) {
                let id = y*this.size+x;
                outputHTML += `<input type="number" min="0" id="${id}" size="2" value="0">`;
                this.playFieldValues[id] = 0;
            }
            outputHTML += "<br>"
        }
        $(`#${this.divName}`).html(outputHTML);
        this.playFieldHTML = outputHTML;

        // for(let i = 0; i < this.maxSize; i++) {
        //     $(`#${this.divName} #${i}`).change(() => {
        //         let newVal = $(`#${this.divName} #${i}`).val();
        //         this.setValue(i, newVal);
        //         // this.playFieldValues[i] = newVal;
        //     });
        // }
    }

    getValue(x, y) {
        let id = y*this.size+x;
        if (id >= this.maxSize) return -1;
        return this.playFieldValues[id];
    }

    // setValue(x, y, v) {
    //     let id = y*this.size+x;
    //     if (id >= this.maxSize) return;
    //     this.playFieldValues[id] = v;
    //     $(`#${this.divName} #${id}`).val(v);
    // }

    showArray() {
        for(let i = 0; i < this.maxSize; i++) {
            let v = this.playFieldValues[i];
            $(`#${this.divName} #${i}`).val(v);
        }
    }

    setValue(id, v) {
        if (id >= this.maxSize) return;
        this.playFieldValues[id] = v;
        $(`#${this.divName} #${id}`).val(v);
    }

    setArray() {
        for(let i = 0; i < this.maxSize; i++) {
            let v = this.playFieldValues[i];
            this.setValue(i, v);
        }
    }

    overrideArray(arr) {
        if(arr.length != this.playFieldValues.length) return;
        this.playFieldValues = arr;
        this.showArray();
    }

    checkPossible(x, y, v) {
        let id = y*this.size+x;
        
        // check in x direction
        for(let xi = 0; xi < this.size; xi++) {
            if(xi == x) continue;
            let curID = y*this.size+xi;
            let curV = this.playFieldValues[curID];
            if(curV == 0) continue;
            if(v == curV) return false;
        }

        for(let yi = 0; yi < this.size; yi++) {
            if(yi == y) continue;
            let curID = yi*this.size+x;
            let curV = this.playFieldValues[curID];
            if(curV == 0) continue;
            if(v == curV) return false;
        }

        if(this.size == 9) {
            let x0 = Math.floor(x/3);
            let y0 = Math.floor(y/3);
            for(let yi = 0; yi < 3; yi++) {
                for (let xi = 0; xi < 3; xi++) {
                    let absX = x0 * 3 + xi;
                    let absY = y0 * 3 + yi;

                    // console.log(absX);
                    // console.log(absY);
                    // console.log();

                    if(absX == x && absY == y) continue;
                    let curID = absY*this.size+absX;
                    let curV = this.playFieldValues[curID];
                    if(curV == 0) continue;
                    if(curV == v) return false;
                }
            }
        }
        return true;
    }

    alleBelegt() {
        for(let i = 0; i < this.maxSize; i++) {
            if(this.playFieldValues[i] == 0) return false;
        }
        return true;
    }

    // 0 == unbelegt
    generateAllSolutions() {
        if(this.alleBelegt()) {
            // console.log(this.playFieldValues);
            let cl = [...this.playFieldValues];
            this.allSolutions.push(cl);
            if(this.allSolutions.length == 3) return false;
            return true;
        }
        outer:
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++) {
                if(this.getValue(x,y) == 0) {
                    for(let i = 1; i < this.size+1; i++) {
                        if(this.checkPossible(x,y,i)) {
                            let id = y*this.size+x;
                            this.setValue(id,i);
                            // console.log(`Set Value ${i} on position ${id}`);
                            if(!this.generateAllSolutions()) {
                                break outer;
                            };
                            this.setValue(id,0);
                        }
                    }
                    // console.log(this.playFieldValues);
                    
                    return true;
                }


            }
        }
        console.log("Finished!");
        return true;
    }

    showSolution(id) {
        if(this.allSolutions.length == 0) return;

        this.playFieldValues = this.allSolutions[id];
        this.showArray();


    }

    solve() {
        this.allSolutions = [];
        this.generateAllSolutions();
        this.showSolution(0);
        for(let i = 0; i < this.allSolutions.length; i++) {
            $("#solutionsSelector").append (
                `<option value="${i}">Solution ${i+1}</option>`
            );
        }

        $("#solutionsSelector").change(() => {
            let val = $("#solutionsSelector").val();
            this.showSolution(val);
        });

    }

  }

function returnTestSoduku() {
    let newPlayfield = 
    [   8,0,0, 9,3,0, 0,0,2,
        0,0,9, 0,0,0, 0,4,0,
        7,0,2, 1,0,0, 9,6,0,
        
        2,0,0, 0,0,0, 0,9,0,
        0,6,0, 0,0,0, 0,7,0,
        0,7,0, 0,0,6, 0,0,5,
        
        0,2,7, 0,0,8, 4,0,6,
        0,3,0, 0,0,0, 5,0,0,
        5,0,0, 0,6,2, 0,0,8
    ];
    return newPlayfield;
}

export {Sudoku, returnTestSoduku}; 
