#![allow(dead_code)]
use wasm_bindgen::prelude::*;

struct PlayField {
    y_values: Vec<isize>,
    size: usize,
}

impl PlayField {
    pub fn new(size: usize) -> PlayField {
        let y_values =  vec![-1; size];
        PlayField {
            y_values,
            size,
        }
    }

    pub fn check_possible(&self, index: usize, y_pos: isize) -> bool {
        let current_playfield = &self.y_values;//.clone();

        // already taken
        if current_playfield[index] != -1 {
            return false;
        }

        // check diagonal
        for i in 0..index {
            let diff: isize = index as isize - i as isize;

            let cur_val = current_playfield[i];
            if cur_val == y_pos {
                return false;
            }

            // let upper: isize = ;
            let lower = y_pos - diff;
            let upper = y_pos + diff;

            if lower == cur_val || upper == cur_val {
                return false;
            }
        }

        true
    }

    pub fn set_value(&mut self, index: usize, value: isize){ // -> PlayField {
        //let mut old_playfield = self.y_values.clone();
        self.y_values[index] = value;
        /*PlayField {
            y_values: old_playfield,
            size: self.size,
        }*/
    }

    pub fn get_value(&self, index: usize) -> isize {
        self.y_values[index]
    }

    pub fn fully_set(&self) -> bool {
        for v in &self.y_values {
            if *v == -1 {
                return false;
            }
        }
        true
    }
}

fn nqueens(pf: PlayField) -> Option<PlayField> {
    let solved = false;
    let mut index: usize = 0;
    let max_number = pf.size;
    let mut pf = pf;
    let mut last_index: Vec<usize> = vec![0; max_number];

    'outer: while !solved {
        if pf.fully_set() {
            break 'outer;
        }

        for n in last_index[index]..max_number {
            if pf.check_possible(index, n as isize) {
                pf.set_value(index, n as isize);
                last_index[index] = n + 1;
                index += 1;
                continue 'outer;
            }
        }

        if index != 0 {
            last_index[index] = 0;
            index -= 1;
        } else {
            return None;
        }
        pf.set_value(index, -1);
    }

    Some(pf)
}

#[wasm_bindgen]
pub fn solve_nqueens(size: usize) -> Vec<isize> {
    let pf = PlayField::new(size);
    let solution = nqueens(pf);

    let ret = match solution {
        Some(spf) => spf.y_values,
        _ => vec![-1],
    };

    ret
}

#[cfg(test)]
mod solver {
    use super::*;

    #[test]
    fn solving_3() {
        let mut test_pf = PlayField::new(3);
        let solution = nqueens(test_pf);
        assert!(solution.is_none())
    }

    #[test]
    fn solving_4() {
        let mut test_pf = PlayField::new(4);
        let solution = nqueens(test_pf);
        assert!(solution.is_some());
        let pf = solution.unwrap().y_values;
        for v in pf {
            println!("{v}");
        }
    }

    #[test]
    fn solving_8() {
        let mut test_pf = PlayField::new(8);
        let solution = nqueens(test_pf);
        assert!(solution.is_some());
        let pf = solution.unwrap().y_values;
        for v in pf {
            println!("{v}");
        }
    }

    #[test]
    fn solving_16() {
        let mut test_pf = PlayField::new(16);
        let solution = nqueens(test_pf);
        assert!(solution.is_some());
        let pf = solution.unwrap().y_values;
        for v in pf {
            println!("{v}");
        }
    }

    /*#[test]
    fn solving_24() {
        let test_pf = PlayField::new(24);
        let solution = nqueens(test_pf);
        assert!(solution.is_some());
        let pf = solution.unwrap().y_values;
        for v in pf {
            println!("{v}");
        }
    }*/
}

#[cfg(test)]
mod struct_functions {
    use super::*;

    #[test]
    fn new_test() {
        let mut test_pf = PlayField::new(2);
        assert_eq!(test_pf.y_values, [-1, -1]);
        assert_eq!(test_pf.size, 2);
    }

    #[test]
    fn check_empty() {
        let mut test_pf = PlayField::new(3);
        assert!(test_pf.check_possible(0, 2))
    }

    #[test]
    fn check_hor_true() {
        let mut test_pf = PlayField::new(3);
        let test_vec: Vec<isize> = vec![0, -1, -1];
        test_pf.y_values = test_vec;
        assert!(test_pf.check_possible(1, 2))
    }

    #[test]
    fn check_vert_false() {
        let mut test_pf = PlayField::new(3);
        let test_vec: Vec<isize> = vec![1, -1, -1];
        test_pf.y_values = test_vec;
        assert!(!test_pf.check_possible(1, 0));
        assert!(!test_pf.check_possible(1, 2))
    }

    #[test]
    fn check_vert_true() {
        let mut test_pf = PlayField::new(3);
        let test_vec: Vec<isize> = vec![0, -1, -1];
        test_pf.y_values = test_vec;
        assert!(test_pf.check_possible(1, 2))
    }

    #[test]
    fn check_vert_bigger() {
        let mut test_pf = PlayField::new(3);
        let test_vec: Vec<isize> = vec![0, 2, -1, -1, -1];
        test_pf.y_values = test_vec;
        assert!(test_pf.check_possible(2, 4));
        assert!(!test_pf.check_possible(2, 1));
        assert!(!test_pf.check_possible(2, 2));
    }

    #[test]
    fn test_set() {
        let mut test_pf = PlayField::new(3);
        let valid: Vec<isize> = vec![0, 1, 2];

        test_pf.set_value(0, 0);
        test_pf.set_value(1, 1);
        test_pf.set_value(2, 2);

        assert_eq!(test_pf.y_values, valid);
    }

    #[test]
    fn test_get() {
        let mut test_pf = PlayField::new(3);

        test_pf.set_value(0, 0);
        test_pf.set_value(1, 1);
        test_pf.set_value(2, 2);

        let v1 = test_pf.get_value(0);
        let v2 = test_pf.get_value(1);
        let v3 = test_pf.get_value(2);

        assert_eq!(v1, 0);
        assert_eq!(v2, 1);
        assert_eq!(v3, 2);
    }

    #[test]
    fn fully_set_test_true() {
        let mut test_pf = PlayField::new(3);
        test_pf.set_value(0, 0);
        test_pf.set_value(1, 1);
        test_pf.set_value(2, 2);
        assert!(test_pf.fully_set())
    }

    #[test]
    fn fully_set_test_false() {
        let mut test_pf = PlayField::new(3);
        test_pf.set_value(0, 0);
        assert!(!test_pf.fully_set())
    }
}
