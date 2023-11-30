class Chomp {

    /** @type {Array[Array[string]]} */
    tokens

    /** @type {HTMLUListElement} */
    stack_list

    /** @type {HTMLUListElement} */
    output_stack

    delay_time_in_ms = 100

    current_structure = null
    current_reference = null

    typo_required = undefined

    grammar = {
        variable_declaration: {
            V: [
                { reg: /^str$/, next: "A", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'str' },
                { reg: /^num$/, next: "A", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'num' },
                { reg: /^bool$/, next: "A", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'bool' }
            ],
            A: [
                {
                    reg: /^[^0-9][a-zA-Z0-9]*$/,
                    next: "C",
                    msg: "coincide con caracteres alfanuméricos que no comiencen con un número."
                }
            ],
            C: [
                { reg: /^:$/, next: "D", msg: "coincide con el carácter ':'" }
            ],
            D: [
                {
                    reg: /^(?!.*\.\.)(?!^\.)\d+(\.\d+)?$/, next: "E", msg: "coincide en uno o más dígitos numéricos",
                    given: 'num'
                },
                {
                    reg: /^"$/, next: "F", msg: "coincide con el carácter '\"'",
                    given: 'str'
                },
                {
                    reg: /^true$/, next: "J", msg: "coincide con los tipos de datos permitido: str | num | bool ",
                    given: 'bool'
                },
                {
                    reg: /^false$/, next: "J", msg: "coincide con los tipos de datos permitido: str | num | bool ",
                    given: 'bool'
                }
            ],
            E: [
                { reg: /^;$/, next: null, msg: "coincide con el carácter ';'" }
            ],
            F: [
                { reg: /^[a-zA-Z0-9]*$/, next: "I", msg: "cualquier combinación de caracteres alfanuméricos" }
            ],
            I: [
                { reg: /^"$/, next: "J", msg: "coincide con el carácter '\"'" },
                { reg: /^[a-zA-Z0-9]*$/, next: "I", msg: "cualquier combinación de caracteres alfanuméricos" }
            ],
            J: [
                { reg: /^;$/, next: null, msg: "coincide con el carácter ';'" }
            ]
        },
        function_declaration: {
            K: [
                { reg: /^fn$/, next: "L", msg: "coincide con la palabra reservada fn" }
            ],
            L: [
                { reg: /^[^0-9][a-zA-Z0-9]*$/, next: "O" }
            ],
            O: [
                { reg: /^\($/, next: "P" }
            ],
            P: [
                { reg: /^str$/, next: "Q", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'str' },
                { reg: /^num$/, next: "Q", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'num' },
                { reg: /^bool$/, next: "Q", msg: "coincide con los tipos de datos permitido: str | num | bool ", wanted: 'bool' },
                { reg: /^\)$/, next: "S" }
            ],
            Q: [
                { reg: /^[^0-9][a-zA-Z0-9]*$/, next: "R" }
            ],
            R: [
                { reg: /^\)$/, next: "S" },
                { reg: /^,$/, next: "P" }
            ],
            S: [
                { reg: /^:$/, next: "T", msg: "coincide con el carácter ':'" }
            ],
            T: [
                { reg: /^str$/, next: "U", msg: "coincide con los tipos de datos permitido: str | num | bool | void " },
                { reg: /^num$/, next: "U", msg: "coincide con los tipos de datos permitido: str | num | bool | void " },
                { reg: /^bool$/, next: "U", msg: "coincide con los tipos de datos permitido: str | num | bool | void " },
                { reg: /^void$/, next: "U", msg: "coincide con los tipos de datos permitido: str | num | bool | void " },
            ],
            U: [
                { reg: /^{$/, next: null, scopable: true },
            ]
        },
        conditional_declaration: {
            X: [
                { reg: /^if$/, next: "Y", msg: "coincide con la palabra reservada 'if'" },
            ],
            Y: [
                { reg: /^[^0-9][a-zA-Z0-9]*$/, next: "Z", msg: "coincide con caracteres alfanuméricos que no comiencen con un número." },
                {
                    reg: /^(?!.*\.\.)(?!^\.)\d+(\.\d+)?$/, next: "Z", msg: "coincide en uno o más dígitos numéricos"
                },
            ],
            Z: [
                { reg: /^\>$/, next: "ZA" },
                { reg: /^\<$/, next: "ZA" },
                { reg: /^\=\=$/, next: "ZA" },
                { reg: /^\>\=$/, next: "ZA" },
                { reg: /^\<\=$/, next: "ZA" },
                { reg: /^!\=$/, next: "ZA" },
            ],
            ZA: [
                { reg: /^[^0-9][a-zA-Z0-9]*$/, next: "ZB", msg: "coincide con caracteres alfanuméricos que no comiencen con un número." },
            ],
            ZB: [
                { reg: /^{$/, next: null, scopable: true },
            ]
        }
    }

    scope = [[]]

    constructor(tokens, stack_list, output_stack) {
        this.tokens = tokens
        this.stack_list = stack_list
        this.output_stack = output_stack
    }

    async start_stream() {
        let is_all_right = true
        for (let line_number = 0; line_number < this.tokens.length; line_number++) {

            for (let token_number = 0; token_number < this.tokens[line_number].length; token_number++) {

                stack.firstChild.classList.add("active")

                if (!this.verify_token(this.tokens[line_number][token_number], line_number + 1)) {
                    is_all_right = false
                    this.stack_list.firstChild.classList.add("error");
                    break
                }

                await this.sleep()
                stack.firstChild.remove()
            }

            if (!is_all_right) {
                return
            }
        }
        const bubble = document.createElement('li')
        if (this.scope.length > 1) {
            bubble.classList.add('error')
            bubble.innerHTML = `<strong>Error</strong>: Carácteres "}" faltantes.`
        } else {
            bubble.classList.add('success')
            bubble.innerHTML = `<strong>¡Enhorabuena!</strong>: Tu código está bien escrito.`
        }
        this.output_stack.appendChild(bubble)
        this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
    }

    sleep() {
        return new Promise(resolve => setTimeout(resolve, this.delay_time_in_ms))
    }

    verify_token(token, line) {
        // Si ya acabó la estructura actual, o está por empezar.
        if (this.current_reference === null || this.current_structure === null) {
            if (!this.recognize_structure(token, line)) {
                return false
            }
            return true
        }

        if (!this.recognize_alternative(token, line)) {
            return false
        }

        return true
    }

    recognize_structure(token, line) {
        if (token === '}') {
            let res = true
            this.scope.pop()

            const bubble = document.createElement('li')

            if (this.scope.length === 0) {
                bubble.classList.add('error')
                bubble.innerHTML = `<strong>Error en la línea ${line}:</strong> Carácter '}' inesperado.`
                res = false
            } else {
                bubble.innerHTML = `<strong>Saliendo</strong> de un scope en la línea ${line}.`
            }
            this.output_stack.appendChild(bubble)
            this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
            return res
        }

        for (let key_index = 0; key_index < Object.keys(this.grammar).length; key_index++) {
            const structure_in_revision = this.grammar[Object.keys(this.grammar)[key_index]];
            const first_key = Object.keys(structure_in_revision)[0]
            const rules = structure_in_revision[first_key]

            for (let rule_count = 0; rule_count < rules.length; rule_count++) {
                if (rules[rule_count].reg.test(token)) {
                    this.current_structure = Object.keys(this.grammar)[key_index]
                    this.current_reference = this.grammar[this.current_structure][first_key][rule_count].next
                    if (this.grammar[this.current_structure][first_key][rule_count].wanted) {
                        this.typo_required = this.grammar[this.current_structure][first_key][rule_count].wanted
                    }
                    // this.current_alternative = rule_count
                    const bubble = document.createElement('li')
                    bubble.classList.add('info')
                    bubble.innerHTML = `Estructura reconocida en la línea ${line}: <strong>${this.current_structure}</strong>`
                    this.output_stack.appendChild(bubble)
                    this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
                    return true
                }
            }
        }

        const bubble = document.createElement('li')
        bubble.classList.add('error')
        bubble.innerHTML = `<strong>Error en la línea ${line}</strong>: No se pudo reconocer ninguna estrutura.`
        this.output_stack.appendChild(bubble)
        this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
        return false
    }

    recognize_alternative(token, line) {
        const alternatives = this.grammar[this.current_structure][this.current_reference]
        for (let option = 0; option < alternatives.length; option++) {
            if (alternatives[option].reg.test(token)) {
                // console.log(alternatives[option].reg + "->", token)
                this.current_reference = alternatives[option].next
                if (alternatives[option].wanted) {
                    this.typo_required = alternatives[option].wanted
                }
                if (this.typo_required && alternatives[option].given && (alternatives[option].given !== this.typo_required)) {
                    const bubble = document.createElement('li')
                    bubble.classList.add('warn')
                    bubble.innerHTML = `<strong>Alerta de tipado en la línea ${line}</strong>: Tu declaración actual requiere un valor de tipo <strong>${this.typo_required}</strong> y el valor dado es de tipo <strong>${alternatives[option].given}</strong>`;
                    this.typo_required = null
                    this.output_stack.appendChild(bubble)
                    this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
                }
                if (alternatives[option].scopable) {
                    const bubble = document.createElement('li')
                    bubble.innerHTML = `<strong>Ingresando</strong> a un nuevo scope en la línea ${line}.`
                    this.output_stack.appendChild(bubble)
                    this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
                    this.scope.push([])
                }
                return true
            }
        }
        const bubble = document.createElement('li')
        bubble.classList.add('error')
        bubble.innerHTML = `<strong>Error en la línea ${line}</strong>: La entrada no ${this.grammar[this.current_structure][this.current_reference][0]["msg"]}`
        console.log(this.grammar[this.current_structure][this.current_reference][0])
        this.output_stack.appendChild(bubble)
        this.output_stack.parentNode.scrollTop = this.output_stack.parentNode.scrollHeight;
        return false
    }

    verify_scopable(token) {

    }
}