# BenchmarkTest
This is the application used to benchmark JavaScript with WebAssembly using multiple algorithms. The database is not provided due to privacy concerns. 
Instead, an empty database with the needed schema is provided in the database folder.

## How to use it

1. Clone the repository
2. Go in the Folder
3. Execute `npm i` to install the needed packages
4. The server can than be started by running `node server.js`

## Folders

### database

Includes the 'users.db' database, which has the data about benchmark times and user information. 'empty.db' can be renamed to create a empty database.

### html

Holds all HTML web pages.

### images

Loading gifs, which are used temporarily.

### libaries

Includes all JavaScript sources that are used regularly. Also holds some libraries that were used for testing.

### old

Not more used files.

### Rust

Rust source files of benchmark algorithms.

### scripts

All script files which are used. Includes the benchmark algorithms in JavaScript, scripts to process the cookies, and user information.

### stylesheets

CSS style sheets.

### wasm

Includes the WebAssembly binaries, which were generated from Rust using wasm-pack. Also includes glue code.
