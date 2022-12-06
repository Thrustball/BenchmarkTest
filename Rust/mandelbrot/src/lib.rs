#![allow(dead_code)]

use wasm_bindgen::prelude::*;

const IMAGE_SIZE: usize = 1000;

const OUTPUT_BUFFER_SIZE: usize = IMAGE_SIZE * IMAGE_SIZE * 4;
static mut OUTPUT_BUFFER: [u8; OUTPUT_BUFFER_SIZE] = [0; OUTPUT_BUFFER_SIZE];

const MAX_ITERATIONS: usize = 450;

#[wasm_bindgen]
pub fn get_image_ptr() -> *const u8 {
    let ptr: *const u8;
    unsafe {
        ptr = OUTPUT_BUFFER.as_ptr();
    }
    ptr
}

const X_MIN: f32 = -2.00;
const X_MAX: f32 =  0.47;
const Y_MIN: f32 = -1.12;
const Y_MAX: f32 =  1.12;

#[wasm_bindgen]
pub fn generate_mandelbrot(show_x: f32, show_y: f32, square_size: f32) {
    // let x_step: f32 = 2.47 / IMAGE_SIZE as f32;
    // let y_step: f32 = 2.24 / IMAGE_SIZE as f32;

    // let mut x0 = X_MIN;
    // let mut y0 = Y_MAX;

    // To generate this for the whole picture, set it to 0.0, 0.0, IMAGE_SIZE
    // let show_x = 700.0;
    // let show_y = 90.0;
    // let square_size = 130 as f32;

    let show_x_min = map_range(show_x, 0.0, IMAGE_SIZE as f32, X_MIN, X_MAX);
    let show_y_min = map_range(show_y, 0.0, IMAGE_SIZE as f32, Y_MIN, Y_MAX);
    let show_x_max = map_range(show_x + square_size, 0.0, IMAGE_SIZE as f32, X_MIN, X_MAX);
    let show_y_max = map_range(show_y + square_size, 0.0, IMAGE_SIZE as f32, Y_MIN, Y_MAX);



    for py in 0..IMAGE_SIZE {

        for px in 0..IMAGE_SIZE {

            // let mut colour: u8 = 0;

            let mut x: f32 = 0.0;
            let mut y: f32 = 0.0;
            let x0 = map_range(px as f32, 0.0, IMAGE_SIZE as f32, show_x_min, show_x_max);
            let y0 = map_range(py as f32, 0.0, IMAGE_SIZE as f32, show_y_min, show_y_max);
            // println!("x0: {x0}");

            let mut iteration = 0;

            let mut x2 = 0.0;
            let mut y2 = 0.0;

            while x2 + y2 <= 4.0 && iteration < MAX_ITERATIONS {
                y = 2.0 * x * y + y0;
                x = x2 - y2 + x0;
                x2 = x * x;
                y2 = y * y;
                iteration += 1;
            }

            let colour: u8 = map_range(iteration as f32, 0.0, MAX_ITERATIONS as f32, 0.0, 255.0) as u8;

            let index: usize = (py * IMAGE_SIZE + px) * 4;

            unsafe {
                OUTPUT_BUFFER[index] = colour;
                OUTPUT_BUFFER[index+1] = colour;
                OUTPUT_BUFFER[index+2] = colour;
                OUTPUT_BUFFER[index+3] = 255;
            }

        }
    }


}

fn map_range(input: f32, input_start: f32, input_end: f32,
                output_start: f32, output_end: f32) -> f32 {
    // let slope = (output_end - output_start) / (input_end - input_start);
    output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
    // output
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
