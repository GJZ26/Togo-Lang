/**
 * 
 * #########################################################################
 * -------------------------------------------------------------------------
 * #########################################################################
 * @deprecated
 * 
 * ESTE ES EL CODIGO DE LA PRIMERA VERSION DEL LEXER
 *
 * SE HA MODIFICADO ALGUNOS PARAMÉTROS DESDE SU´ULTIMA VERSIÓN, ASI QUE PUEDE
 * NO FUNCIONAR.
 * 
 * EN SU LUGAR VER: automaton.js
 * 
 * 
 * #########################################################################
 * -------------------------------------------------------------------------
 * #########################################################################
 * 
 */

/**
 * 
 * @param {Array} code_as_array Codigo como arrary, cada elemento es una línea del codigo original
 */
function validar(code_as_array) {
    stack.innerHTML = ""
    out.innerHTML = ""

    const code_tokens = [

    ]

    tokenizer(0, code_as_array, code_tokens)

    for (let i = 0; i < code_tokens.length; i++) {
        for (let j = 0; j < code_tokens[i].length; j++) {
            const tok = document.createElement("li")
            tok.textContent = code_tokens[i][j]
            stack.appendChild(tok)
        }
    }

    token_stream_validation(code_tokens)
}

/**
 * 
 * @param {Number} currentLine 
 * @param {Array<string>} code_as_array
 */
function tokenizer(currentLine, code_as_array, scope_stack) {
    let actual_line = code_as_array[currentLine]
        .replace(/\s+/g, ' ')
        .replace(/(:|{|}|,|\(|\)|;|>|<|==|!=|\+\+|--|")/g, ' $1 ')
        .replace(/\s+/g, ' ')
        .trim().split(" ").filter((token) => token !== "");

    scope_stack.push(actual_line)

    if (currentLine < code_as_array.length - 1) {
        tokenizer(currentLine + 1, code_as_array, scope_stack)
    }
}
/**
 * 
 * @param {Array<Array<string>>} code_tokenized 
 */
function token_stream_validation(code_tokenized) {
    const chom = new Chomp(code_tokenized, stack, out);
    chom.start_stream()
}

/**
 * Este es la clase que validaba la gramática en la primera version de la aplicación.
 * Ignorarla. 
 * Ver la clase Chomp del archivo chompa.js, incluye el lexer actual.
 */
class Automatons {

    functions_typos = {
        void: 'void',
        boolean: 'bool',
        string: 'str',
        nummeric: 'num'
    }

    varibles_typos = {
        boolean: 'bool',
        string: 'str',
        numeric: 'num'
    }

    logic_operators = {
        greater_than: '>',
        lower_than: '<',
        equal_to: '==',
        not_equal_to: '!='
    }

    increment_operator = {
        increment: '\\+\\+',
        decrement: '--'
    }

    scoped_characters = {
        parenthesis_char: {
            open: '\\(',
            closed: '\\)'
        },
        brackets_char: {
            open: '{',
            closed: '}'
        },
        single_quoatation_char: {
            open: "'",
            closed: "'"
        },
        double_quoatation_char: {
            open: '"',
            closed: '"'
        }
    }

    admited_value = {
        numeric: /^(0(\.\d+)?|([1-9]\d*)(\.\d+)?)$/,
        string: /(['"])([^'"]*)\1/g,
        boolean: /^(true|false)$/,
        common_name: /^[a-zA-Z][a-zA-Z0-9]*$/
    }

    delimiter_characters = {
        asignation_char: ':',
        comma_char: ',',
        end_line_char: ';'
    }

    isolated_structures = {
        params: [
            [
                this.varibles_typos,
                this.admited_value['common_name'],
                this.delimiter_characters['comma_char']
            ],
            [
                this.varibles_typos,
                this.admited_value['common_name']
            ]
        ]
    }

    structures = {
        numeric_variable_definition: {
            type: "variable",
            return_type: "numeric",
            named_in: 1,
            reserved: this.varibles_typos['numeric'],
            sample: "num varName: 1.0;",
            params: null,
            self_scope: false,
            patterns: [
                [
                    this.varibles_typos['numeric'],
                    this.admited_value['common_name'],
                    this.delimiter_characters['asignation_char'],
                    this.admited_value['numeric'],
                    this.delimiter_characters['end_line_char']
                ]
            ]
        },
        string_variable_definition: {
            type: "variable",
            return_type: "string",
            named_in: 1,
            reserved: this.varibles_typos['string'],
            sample: 'str varName: "value";',
            params: null,
            self_scope: false,
            patterns: [
                [
                    this.varibles_typos['string'],
                    this.admited_value['common_name'],
                    this.delimiter_characters['asignation_char'],
                    this.admited_value['string'],
                    this.delimiter_characters['end_line_char']
                ]
            ]
        },
        boolean_variable_definition: {
            type: "variable",
            return_type: "boolean",
            named_in: 1,
            reserved: this.varibles_typos['boolean'],
            sample: "bool varName: true;",
            params: null,
            self_scope: false,
            patterns: [
                [
                    this.varibles_typos['boolean'],
                    this.admited_value['common_name'],
                    this.delimiter_characters['asignation_char'],
                    this.admited_value['boolean'],
                    this.delimiter_characters['end_line_char']
                ]
            ]
        },
        function_definition: {
            type: "function",
            return_type: "auto",
            named_in: 1,
            reserved: 'fn',
            sample: "fn functionName(type paramName, ..):returnType { [code] }",
            params: true,
            self_scope: true,
            patterns: [
                [
                    'fn',
                    this.admited_value['common_name'],
                    this.scoped_characters['parenthesis_char'].open,
                    '< params >',
                    this.scoped_characters['parenthesis_char'].closed,
                    this.delimiter_characters['asignation_char'],
                    this.functions_typos,
                    this.scoped_characters['brackets_char'].open,
                    '< scoped_code >',
                    this.scoped_characters['brackets_char'].closed
                ]
            ]
        },
        if_conditional: {
            type: "conditional",
            return_type: "none",
            named_in: -1,
            reserved: 'if',
            sample: "if val op val { [code] }",
            params: true,
            self_scope: true,
            patterns: [
                [
                    'if',
                    '< registered_variable >',
                    this.logic_operators,
                    '< registered_variable >',
                    this.scoped_characters['brackets_char'].open,
                    '< scoped_code >',
                    this.scoped_characters['brackets_char'].closed
                ],
                [
                    'if',
                    this.admited_value['numeric'],
                    this.logic_operators,
                    this.admited_value['numeric'],
                    this.scoped_characters['brackets_char'].open,
                    '< scoped_code >',
                    this.scoped_characters['brackets_char'].closed
                ],
                [
                    'if',
                    this.admited_value['string'],
                    this.logic_operators,
                    this.admited_value['string'],
                    this.scoped_characters['brackets_char'].open,
                    '< scoped_code >',
                    this.scoped_characters['brackets_char'].closed
                ]
            ]
        },
        for_loop: {
            type: "loop",
            return_type: "none",
            named_in: -1,
            reserved: 'for',
            sample: "for(var: val, var op amount, var ip){ [code] }",
            params: false,
            self_scope: true,
            patterns: [
                [
                    'for',
                    this.scoped_characters['parenthesis_char'].open,
                    this.admited_value['common_name'],
                    this.delimiter_characters['asignation_char'],
                    this.admited_value['numeric'],
                    this.delimiter_characters['comma_char'],
                    this.admited_value['common_name'],
                    this.logic_operators,
                    this.admited_value['numeric'],
                    this.delimiter_characters['comma_char'],
                    this.admited_value['common_name'],
                    this.increment_operator,
                    this.scoped_characters['parenthesis_char'].closed,
                    this.scoped_characters['brackets_char'].open,
                    '< scoped_code >',
                    this.scoped_characters['brackets_char'].closed,
                ]
            ]
        }
    }

    scope = { global: [] }
    currentStructure = null;
    currentStep = null;
    insolated_step = 0
    is_insolated = false
    reset = false
    context_typo = null

    constructor() {

    }

    im_read_token(word) {
        if (word === "") {
            return [true, ""]
        }
        if (word === "}") {
            let currentScope = Object.keys(this.scope)[Object.keys(this.scope).length - 1]
            // console.log(currentScope)
            delete this.scope[currentScope]
            return [true, ""]
        }
        do {
            if (this.reset) {
                this.currentStructure = null;
                this.currentStep = null;
                this.insolated_step = 0
                this.is_insolated = false
                this.reset = false
            }

            let errorMessage = ""
            if (!this.currentStructure) {
                errorMessage = this.__structure_clasification(word)

                if (!this.currentStructure) {
                    return [false, errorMessage]
                }
            }

            let stepResult = this.__validate_step(word);
            if (!stepResult[0]) return stepResult

        } while (this.reset)


        // console.log(this.scope)
        // console.log(this.scope)
        return [true, ""]
    }

    __structure_clasification(word) {
        for (let i = 0; i < Object.keys(this.structures).length; i++) {
            if (word === this.structures[Object.keys(this.structures)[i]].reserved) {
                this.currentStructure = Object.keys(this.structures)[i]
                this.currentStep = 0
                this.currentAlternative = 0
                return
            }
        }
        return `La palabra "${word}" parece no pertenecer a niguna estructura.`
    }

    __validate_step(word) {

        let result = false;
        let exp = null

        for (let i = 0; i < this.structures[this.currentStructure].patterns.length; i++) {

            exp = new RegExp(this.structures[this.currentStructure].patterns[i][this.currentStep])

            if (typeof this.structures[this.currentStructure].patterns[i][this.currentStep] === "object") {
                if (!Object.prototype.toString.call(this.structures[this.currentStructure].patterns[i][this.currentStep]).includes("RegExp")) {
                    exp = new RegExp(this.__object_to_regex(this.structures[this.currentStructure].patterns[i][this.currentStep]))
                }
            }

            result = result || exp.test(word)

            //             console.log(
            //                 `Regla: ${exp}
            // Palabra: ${word}
            // Estructura: ${this.currentStructure}
            // Scope: ${Object.keys(this.scope)[Object.keys(this.scope).length - 1]}
            // Step: ${this.currentStep}`
            //             )

        }


        if (typeof this.structures[this.currentStructure].patterns[this.currentAlternative][this.currentStep] === 'string') {
            const insolated = this.structures[this.currentStructure].patterns[this.currentAlternative][this.currentStep].match(/<([^>]*)>/)
            if (insolated && !result) {
                result = this.do_insolated_structure(insolated[1].trim(), word)
            }
        }

        let errMsg = `La ${this.structures[this.currentStructure].type} no cumple con la estrucura deseada: ${this.structures[this.currentStructure].sample}`

        let varAvailability = this.__scope_register(word)
        if (varAvailability) {
            result = varAvailability[0]
            errMsg = varAvailability[1]
        }

        if (this.currentStep === this.structures[this.currentStructure]
            .patterns[this.currentAlternative]
            .length - 1) {
            this.currentStructure = null
        }

        this.currentStep++
        return [result, errMsg]
    }

    __scope_register(word) {
        let currentScope = Object.keys(this.scope)[Object.keys(this.scope).length - 1]
        if (this.currentStep === this.structures[this.currentStructure].named_in) {
            let result = this._check_name_availibity(word)
            if (!result[0]) {
                return result
            }
            this.scope[currentScope].push({
                name: word,
                type: this.structures[this.currentStructure].return_type,
                role: this.structures[this.currentStructure].type,
                params: this.structures[this.currentStructure].params
            })
            if (this.structures[this.currentStructure].self_scope) {
                this.scope[word] = []
                currentScope = word
            }
        }

        if (word === '{' && this.structures[this.currentStructure].type === "conditional" || this.structures[this.currentStructure].type === "loop") {
            let name = "anonymous_scope_" + this.currentStep
            this.scope[name] = []
            currentScope = name
        }

        // console.log(this.scope)
    }

    _check_name_availibity(name) {
        for (let i = 0; i < Object.keys(this.scope).length; i++) {
            for (let j = 0; j < this.scope[Object.keys(this.scope)[i]].length; j++) {
                if (this.scope[Object.keys(this.scope)[i]][j].name === name) {
                    return [
                        false,
                        `El nombre de variable ${name} ya ha sido declarada en el scope ${Object.keys(this.scope)[i]}`
                    ]
                }
            }
        }
        return [true, ""]
    }

    do_insolated_structure(structure, word) {
        const exp = new RegExp(this.structures[this.currentStructure].patterns[this.currentAlternative][this.currentStep + 1])
        let result = false

        if (structure === 'registered_variable') {
            let response = false
            for (let i = 0; i < Object.keys(this.scope).length; i++) {
                (this.scope[Object.keys(this.scope)[i]]).map((vari) => {
                    if (vari.name === word) {
                        if (this.context_typo) {
                            response = this.context_typo === vari.type
                        } else {
                            this.context_typo = vari.type
                            response = true
                        }
                    }
                })
            }
            return response
        } else if (exp.test(word)) {
            this.currentStep++
            this.is_insolated = false
            return true
        } else {
            this.is_insolated = true
            result = this.check_insolated_step(word, structure)
        }

        this.currentStep--
        return result
    }

    check_insolated_step(word, structure) {
        let currentInsolated = this.isolated_structures[structure]
        let almostOneTrue = false
        let biggestIndex = 0
        if (structure === 'scoped_code') {
            this.reset = true
            return true
        }


        for (let i = 0; i < currentInsolated.length; i++) {
            if (currentInsolated[i].length > biggestIndex) {
                biggestIndex = currentInsolated[i].length
            }
            if (currentInsolated[i][this.insolated_step] === undefined) {
                continue;
            }
            let expresion = currentInsolated[i][this.insolated_step]

            if (typeof currentInsolated[i][this.insolated_step] === "object") {
                if (!Object.prototype.toString.call(currentInsolated[i][this.insolated_step]).includes("RegExp")) {
                    expresion = this.__object_to_regex(currentInsolated[i][this.insolated_step])
                }
            }

            let reg = new RegExp(expresion)
            almostOneTrue = almostOneTrue || reg.test(word)

            //             console.log(
            //                 `Insolate Structure  <${structure}>
            // Palabra: ${word}
            // Regla: ${reg}
            // Cumple en esta: ${reg.test(word)}`
            //             )
        }

        this.insolated_step++
        if (this.insolated_step >= biggestIndex) {
            this.insolated_step = 0
        }

        return almostOneTrue
    }

    __object_to_regex(object) {
        let result = "^("
        for (let i = 0; i < Object.keys(object).length; i++) {
            result += object[Object.keys(object)[i]]
            if (i === Object.keys(object).length - 1) {
                result += ")$"
            } else {
                result += "|"
            }
        }
        return result
    }

}