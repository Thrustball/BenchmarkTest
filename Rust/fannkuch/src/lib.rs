use wasm_bindgen::prelude::*;

fn fac(n: usize) -> usize {
    let mut res = 1;

    for i in 2..n+1 {
        res *= i;
    }

    res
}


#[derive(Clone)]
struct Permutations {
    n: usize,
    count: Vec<usize>,
    current: Vec<usize>,
    cur_idx: usize,
    max: usize,
}

impl Permutations {
    pub fn new(n: usize) -> Permutations {
        let mut temp_count: Vec<usize> = Vec::new();
        let mut temp_current: Vec<usize> = Vec::new();
        let temp_max = fac(n);

        //initialize count
        
        for i in 0..n {
            temp_count.push(0);
            temp_current.push(1+i);
        }

        Permutations { n: n, count: temp_count, current: temp_current, cur_idx: 1, max: temp_max }
    }

    pub fn advance(&mut self) {
        if self.cur_idx >= self.max {return}
        let mut i = 1;

        loop {
            let first = self.current[0];

            for j in 0..i {
                self.current[j] = self.current[j+1];
            }
            self.current[i] = first;
            self.count[i] += 1;
            if self.count[i] <= i {break}
            self.count[i] = 0;
            i+=1;
        }
        self.cur_idx += 1;
    }
}



fn flips(temp: &mut Vec<usize>) -> usize {
    let mut flips = 0;
    // let mut temp = l.clone();

    while temp[0] != 1 {
        let first = temp[0] as usize;
        let iter = temp
                                    .clone()
                                    .into_iter();

        let mut revpart = iter
                                    .clone()
                                    .take(first)
                                    .rev()
                                    .collect::<Vec<usize>>();

        let mut rest = iter
                                .rev()
                                .take(temp.len() - revpart.len())
                                .rev()
                                .collect::<Vec<usize>>();
        revpart.append(&mut rest);
        *temp = revpart;
        flips += 1;
        
    }
    flips
}


#[wasm_bindgen]
pub fn fannkuch_wasm(n: usize) -> Vec<isize> {
    let mut checksum: isize = 0;
    let mut max: isize = 0;

    let mut p = Permutations::new(n);

    let max_iter = fac(n);

    for i in 0..max_iter {
        let flips = flips(&mut p.current);
        p.advance();
        if flips > max.try_into().unwrap() {max = flips as isize;}

        if i % 2 == 0 {
            checksum += flips as isize;
        } else {
            checksum -= flips as isize;
        }


    }

    vec![checksum, max]
}




#[cfg(test)]
mod permutation_test {
    use crate::{fac, Permutations, fannkuch_wasm};


    fn print_vec(v: &Vec<usize>) {
        for i in v {
            print!("{i}, ");
        }
        println!();
    }

    #[test]
    fn factorial() {
        let n = 5;  
        let f = fac(n);
        assert_eq!(f, 120);
    }


    #[test]
    fn test_permuts() {
        let n = 3;
        let mut p = Permutations::new(n);
        for _ in 0..6 {
            print_vec(&p.current);
            p.advance();
        }
    }

    #[test]
    fn fannkuch_test() {
        let n = 7;
        let v = fannkuch_wasm(n);
        let c = v[0];
        let m = v[1];

        println!("Checksum: {c}\nMax: {m}");
    }

}
