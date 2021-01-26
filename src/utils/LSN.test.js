import LSN from './LSN';

describe('parsing invalid LSN', () => {
    const output = [];

    test('returns empty array on invalid char', () => {
        const input_invalidChar = "0l++3d++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1b/6b+++3/7b++2/2B++DKD3L"; // with invalid character
        expect(LSN.parse(input_invalidChar)).toEqual(output);
    });

    test('returns empty array on space', () => {
        const input_space = " l++3d ++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1b/6b+++3/7b++2/2B++DKD3L "; // with space
        expect(LSN.parse(input_space)).toEqual(output);
    });

    test('returns empty array on more than three plus symbols', () => {
        const input_threePlus = "l++++3d++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1b/6b+++3/7b++2/2B++DKD3L"; // with more than three + symbol
        expect(LSN.parse(input_threePlus)).toEqual(output);
    });

    test('returns empty array on less than or more than 8 rows (or 7 slashes)', () => {
        const input_rows = "l++3d++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+"; // without 8 rows (7 slashes)
        expect(LSN.parse(input_rows)).toEqual(output);
    });
});


describe('parsing valid LSN', () => {
    const output = [
        ["l++", "", "", "", "d++", "k", "d++", "b++", "", ""],
        ["", "", "b", "", "", "", "", "", "", ""],
        ["", "", "", "B+", "", "", "", "", "", ""],
        ["b++", "", "B", "", "s", "s+", "", "b+++", "", "B+"],
        ["b+++", "", "B+", "", "S+", "S", "", "b++", "", "b"],
        ["", "", "", "", "", "", "b+++", "", "", ""],
        ["", "", "", "", "", "", "", "b++", "", ""],
        ["", "", "B+", "D", "K", "D", "", "", "", "L"]
    ];

    test('returns the board array', () => {
        const input = "l++3d++kd++b++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1b/6b+++3/7b++2/2B+DKD3L";
        expect(LSN.parse(input)).toEqual(output);
    });
});