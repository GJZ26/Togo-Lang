class Automaton {

    grammar = {
        variable: {
            S: {
                next: [
                    ["A", "B"],
                    ["A1", "B1"],
                    ["A2", "B2"],
                ],
                reg: null, // Define la regla que debe aplicarse en esta transición, nulo si no es una transicion final y hace referencia otras transiciones.
                treat_as_word: true, // Define si el token debe ser evaluado como palabra, o iterado letra por letra.
            },
            A: {
                next: [], // Se deja vació en caso de no hacer referencia a alguna regla, NO ELIMINAR EL CAMPO, O PONER NULO
                reg: /^str$/,
                treat_as_word: true
            },
            A1: {
                next: [],
                reg: /^num$/,
                treat_as_word: true
            },
            A2: {
                next: [],
                reg: /^bool$/,
                treat_as_word: true
            },
            B: {
                next: [
                    ["PA", "C"]
                ],
                reg: null,
                treat_as_word: true
            },
            B1: {
                next: [
                    ["PA", "C1"]
                ],
                reg: null,
                treat_as_word: true
            },
            B2: {
                next: [
                    ["PA", "C2"]
                ],
                reg: null,
                treat_as_word: true
            },
            PA: {
                next: [
                    ["L", "PA"]
                    [null] // null == Epsilón, se usa nulo por comodidas y para facilitar validaciones.
                ],
                reg: null,
                treat_as_word: false
            },
            C1: {
                next: [
                    ["DP", "D1"]
                ],
                reg: null,
                treat_as_word: true
            },
            C2: {
                next: [
                    ["DP", "D2"]
                ]
            },
            L: {
                next: [],
                reg: /^[a-zA-Z]$/,
                treat_as_word: false
            },
            D1: {
                next: [
                    ["NU", "PC"]
                ],
                reg: null,
                treat_as_word: true
            },
            D2: {
                next: [
                    ["E2", "PC"]
                ],
                reg: null,
                treat_as_word: true
            },
            C: {
                next: [
                    ["DP", "E"]
                ],
                reg: null,
                treat_as_word: true
            },
            NU: {
                next: [
                    ["D", "PC"]
                ],
                reg: null,
                treat_as_word: true
            },
            E2: {
                next: [],
                reg: /^(true|false)$/,
                treat_as_word: true
            },
            DP: {
                next: [],
                reg: /^:$/,
                treat_as_word: true
            },
            D: {
                next: [],
                reg: /^[0-9]$/,
                treat_as_word: false
            },
            E: {
                next: [
                    ["F", "G"]
                ],
                reg: null,
                treat_as_word: true
            },
            F: {
                next: [],
                reg: /^"$/,
                treat_as_word: true
            },
            G: {
                next: [
                    ["PA", "H"]
                ],
                reg: null,
                treat_as_word: true
            },
            H: {
                next: [
                    ["F", "PC"]
                ],
                reg: null,
                treat_as_word: true
            },
            PC: {
                next: [],
                reg: /^;$/,
                treat_as_word: true
            }
        },

    }

    current_rule = [] // Stack con la regla actual
    tokens = [] // Código pasado a palabras: fn algo => ["fn", "algo"].

    /**
     * 
     * @param {number} delay_between_iteration Tiempo de retardo entre iteración al stack de input
     * @param {Array<string>} code_as_array Código del editor convertido en Array, cada índice es una líne de código.
     * @param {HTMLUListElement} visual_input_stack Elemento HTML donde se apílan los carácteres del código para visualizarlo en el Documento.
     * @param {HTMLUListElement} visual_output_stack Elemento HTML donde se apílan las reglas evaluadas para visualizarlas en el Documento.
     */
    constructor(
        delay_between_iteration,
        code_as_array,
        visual_input_stack,
        visual_output_stack
    ) {
        this.delay_between_iteration = delay_between_iteration || 100;
        this.code_as_array = code_as_array;
        this.visual_input_stack = visual_input_stack;
        this.visual_output_stack = visual_output_stack;
    }

    /**
     * Prepara el código, elimina doble espacios del código y tokeniza los carácteres.
     */
    load() {
        this.visual_input_stack.innerHTML = ''
        this.visual_output_stack.innerHTML = ''
        this.tokens = []

        for (let line_number = 0; line_number < this.code_as_array.length; line_number++) {
            this.tokens.push(
                this.code_as_array[line_number]
                    .replace(/\s+/g, ' ') // Reemplaza todas los dobles espacios en blanco por un único espacio en blanco.
                    .replace(/(:|{|}|,|\(|\)|;|>|<|==|!=|\+\+|--|")/g, ' $1 ') // Los símbolos como :, =, ", etc. les añade espacio al final y al frente,Ejemplo -> num: algo: "alga" => num : algo " alga "
                    .replace(/\s+/g, ' ') // Vuelve a eliminar los dobles espacios por si se generaron nuevos durante el paso anterior
                    .trim() // Elimina espacios al principio y al final
                    .split(" ") // Separa por palabras
                    .filter((token) => token !== "") // Elimina todos los elementos que solo contengan espacios vacíos. Solo útil para cuando se manda con el editor vacío
            )
        }

        for (let line_number = 0; line_number < this.tokens.length; line_number++) {
            for (let token_number = 0; token_number < this.tokens[line_number].length; token_number++) {

                const current_token = document.createElement("li")
                current_token.textContent = this.tokens[line_number][token_number]

                stack.appendChild(current_token)
            }
        }
    }

    start() {
        console.log("😬")
    }
}