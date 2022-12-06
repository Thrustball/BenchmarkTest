use wasm_bindgen::prelude::*;

fn next_collatz(n: usize) -> usize {
    if n % 2 == 0 {return n / 2}
    else {return 3 * n + 1}
}

#[wasm_bindgen]
pub fn count_sequence(start: usize) -> usize {
    let mut c: usize = 0;
    let mut n = start;
    while n > 1 {
        n = next_collatz(n);
        c+=1;
    }
    c
}

// #[cfg(test)]
// mod tests {
//     use crate::count_sequence;

//     #[test]
//     fn it_works() {
//         let result = count_sequence(9);
//         assert_eq!(result, 4);
//     }
// }
