var can_width, can_height, cell_width, cell_height, cw2, ch2;
var grid, number_x, number_y;

function fill_grid_array() {
    let max_index = number_x * number_y;
    grid = [];
    for(let i = 0; i < max_index; i++) {
        grid[i] = false;
    }
}

function draw_grid() {
    for (let x = 0; x < number_x; x++) {
        for (let y = 0; y < number_y; y++) {
            let idx = y * number_y + x;
            let colour = '#f9f9ff';
            if(grid[idx]) {
                colour = '#000'
            }
            $('canvas').drawRect({
                fillStyle: colour,
                x: x*cell_width+cw2+1, y: (y)*cell_height+ch2+1,
                width: cell_width-2, height: cell_height-1
            });
        }
    }
}

function count_living_neighbours(x,y) {
    let c = 0;
    let idx = y * number_y + x;

    let left_free = x >= 0;
    let right_free = x < number_x-1;

    let upper_free = y >= 0;
    let lower_free = y < number_y-1;

    // check n1-n3
    if (upper_free) {
        //n1
        if(left_free && grid[idx-number_y-1]) c++;
            
        // n2
        if(grid[idx-number_y]) c++;

        // n3
        if(right_free && grid[idx-number_y+1]) c++;
    }

    // n4
    if(left_free && grid[idx-1]) c++;

    // n5
    if(right_free && grid[idx+1]) c++;

    if (lower_free) {
        //n1
        if(left_free && grid[idx+number_y-1]) c++;
            
        // n2
        if(grid[idx+number_y]) c++;

        // n3
        if(right_free && grid[idx+number_y+1]) c++;
    }


    return c;
}

function next_conway() {
    let new_grid = [...grid];
    for (let x = 0; x < number_x; x++) {
        for (let y = 0; y < number_y; y++) {
            let c = count_living_neighbours(x,y);
            let idx = y * number_y + x;

            if(grid[idx]) {
                if(c < 2 || c > 3) set_value(x,y,false,new_grid);
            } else {
                if(c == 3) set_value(x,y,true,new_grid);
            }
        }
    }
    grid = [...new_grid];
    draw_empty_grid(number_x, number_y, false);
    draw_grid();    
}

function set_value(x,y,new_v) {
    let idx = y*number_y+x;
    grid[idx] = new_v;
}

function set_value(x,y,new_v, g) {
    let idx = y*number_y+x;
    g[idx] = new_v;
    return g;
}

function get_value(x,y) {
    let idx = y*number_y+x;
    return grid[idx];
}

function draw_empty_grid(x_cells, y_cells, empty_grid_array) {
    $("canvas").clearCanvas();
    can_width = $("canvas").prop("width");
    can_height = $("canvas").prop("height");
    

    number_x = x_cells;
    number_y = y_cells;
    if(empty_grid_array) { fill_grid_array();

    $("canvas").prop("width", can_width + 2);
    $("canvas").prop("height", can_height + 2);
    }
    cell_width = can_width / x_cells;
    cell_height = can_height / y_cells;

    cw2 = cell_width / 2;
    ch2 = cell_height / 2;

    for(let x = 0; x < x_cells;x++)
        for(let y = 0; y < y_cells; y++)
            $('canvas').drawRect({
            strokeStyle: '#666',
            strokeWidth: 2,
            x: (cw2+1)+cell_width*x, y: (ch2+1)+cell_height*y,
            width: cell_width, height: cell_height
            });
}

