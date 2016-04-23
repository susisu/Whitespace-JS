# Whitespace-JS
[Whitespace](https://esolangs.org/wiki/Whitespace) interpreter written in JavaScript

## Usage
```
npm install -g @susisu/whitespace-js
wspace <progfile>
```
It also contains `ws2unws` and `unws2ws` which convert a Whitespace program into a human readable format (named *UnWhitespace*) and vice versa.

For more information, see `wspace -h`.

## Notes
* Numbers and arithmetic have only 32bit precision (not arbitrary precision as the original implementation).
* Programs not terminated by `[LF][LF][LF]` will produce warnings (use `-w, --no-warnings` to suppress them).

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
