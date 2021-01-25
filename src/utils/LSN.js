/** Class representing Laser Setup Notation. */
class LSN {
    /**
     * Converts a Laser Setup Notation (LSN) string into an array.
     * 
     * @param {String} notationText a valid setup LSN string.
     * @returns {Array} the board!
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/SetupNotation.md
     */
    static parse(notationText) {
        // TODO: validate notationText
        // - Tem que ser um string
        // - Deve conter 7 barras (/)
        // – Só pode conter:
        //      - só deve conter as letras entre "k" "s" "d" "b" "l". Pode ser maiscula ou minuscula.
        //      - só deve conter números de "1" até "9"
        //      - "*" (se conter, deve ser o unico elemento da coluna)
        //      - "+" (no máximo 3. se conter, deve estar em frente de uma letra)
        // - Não deve conter nenhum caracter fora dos mencionados acima.
        // - Não deve conter espaços

        
        const parsedBoard = [];
        const fields = notationText.split(" ");
        const boardNotation = fields[0];

        const rows = boardNotation.split("/");
        rows.forEach(row => {
            const colsRaw = row.match(/([ksdbl123456789*]\+{0,3})/gi);
            const cols = colsRaw.flatMap(col => {
                if (col == "*") {
                    col = 10;
                }
                if (parseInt(col)) {
                    return new Array(parseInt(col)).fill("");
                }
                return col;
            });
            parsedBoard.push(cols);
        });
        return parsedBoard;
    }
}

export default LSN;