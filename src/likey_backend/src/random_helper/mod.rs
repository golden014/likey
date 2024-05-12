pub(crate) struct ManualRng {
    state: u64,
}

impl ManualRng {
    pub (crate) fn new(seed: u64) -> Self {
        ManualRng { state: seed }
    }

    pub (crate) fn next(&mut self) -> u64 {
        self.state = self.state.wrapping_mul(6364136223846793005).wrapping_add(1);
        self.state
    }
}

//to shuffle a vector of objects, the seed usually is time()
pub (crate)fn shuffle<T>(vec: &mut Vec<T>, seed: u64) {
    let mut rng = ManualRng::new(seed);
    let len = vec.len();
    for i in (1..len).rev() {
        let j = rng.next() as usize % (i + 1);
        vec.swap(i, j);
    }
}

