# Whitespace-JS
[Whitespace](https://esolangs.org/wiki/Whitespace) interpreter written in JavaScript

## Usage
```
npm install -g @susisu/whitespace-js
wspace <progfile>
```
It also contains `ws2unws` and `unws2ws` which convert a Whitespace program into a human readable format (named *UnWhitespace*) and vice versa.

## Note
This implementation is different from the original one in that

* numbers and arithmetic have only 32bit precision (not arbitrary precision), and
* labels are not represented as strings but numbers,

so programs assuming those features won't work.

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
