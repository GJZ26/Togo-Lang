const ligature_btn = document.getElementById("ligature-btn");
const editor = document.getElementById("editor")
const embConsole = document.getElementById("console")
const autocode = document.getElementById("autocode")
const validateBtn = document.getElementById('validate')
const deleteBtn = document.getElementById('borrar')

ligature_btn.addEventListener('click', (e) => {
    if (e.target.getAttribute("checked") === "false") {
        e.target.textContent = "Desactivar ligatures"
        document.body.removeAttribute("style")
    } else {
        e.target.textContent = "Activar ligatures"
        document.body.style.fontVariantLigatures = "none"
    }

    e.target.setAttribute("checked", !(e.target.getAttribute("checked") === "true"))
})

deleteBtn.addEventListener('click',()=>{
    editor.innerHTML = ""
    add_new_paragraph()
})

function loadEditor() {
    editor.innerHTML = ""
    add_new_paragraph()
    embConsole.textContent = "Presione 'validar', en el panel de arriba para comprobar tu código."
    autocode.addEventListener('click', () => {
        loadPreBuildCode()
    })
}

function loadPreBuildCode() {
    const selectedCode = codes[randomIntFromInterval(0, codes.length - 1)]
    editor.innerHTML = ""
    selectedCode.map((line, index) => {
        const paragraph = document.createElement("div")
        paragraph.setAttribute('line', index + 1)
        paragraph.contentEditable = true;
        paragraph.innerHTML = line.replace(/ /g, '&nbsp;');
        paragraph.addEventListener('keydown', (e) => keyDown(e))
        editor.appendChild(paragraph)
    })
}

// function validar() {
//     embConsole.textContent = "Validando codigo..."

//     const functions_typos = {
//         void: 'void',
//         boolean: 'bool',
//         string: 'str',
//         nummeric: 'num'
//     }

//     const varibles_typos = {
//         boolean: 'bool',
//         string: 'str',
//         numeric: 'num'
//     }

//     const logic_operators = {
//         greater_than: '>',
//         lower_than: '<',
//         equal_to: '==',
//         not_equal_to: '!='
//     }

//     const increment_operator = {
//         increment: '++',
//         decrement: '--'
//     }

//     const scoped_characters = {
//         parenthesis_char: {
//             open: '(',
//             closed: ')'
//         },
//         brackets_char: {
//             open: '{',
//             closed: '}'
//         },
//         single_quoatation_char: {
//             open: "'",
//             closed: "'"
//         },
//         double_quoatation_char: {
//             open: '"',
//             closed: '"'
//         }
//     }

//     const admited_value = {
//         numeric: '/^(0(\.\d+)?|([1-9]\d*)(\.\d+)?)$/',
//         string: '/^\d+$/',
//         boolean: '/^(true|false)$/',
//         common_name: '/^[a-zA-Z][a-zA-Z0-9]*$/'
//     }

//     const delimiter_characters = {
//         asignation_char: ':',
//         list_char: ',',
//         end_line_char: ';'
//     }

//     const structures = {
//         numeric_variable_definition: {
//             name: 'numeric_variable_definition',
//             type: 'variable',
//             patterns: [
//                 [
//                     varibles_typos['numeric'],
//                     admited_value['common_name'],
//                     delimiter_characters['asignation_char'],
//                     admited_value['numeric'],
//                     delimiter_characters['end_line_char']
//                 ]
//             ]
//         },
//         string_variable_definition: {
//             name: 'string_variable_definition',
//             type: 'variable',
//             patterns: [
//                 [
//                     varibles_typos['string'],
//                     admited_value['common_name'],
//                     delimiter_characters['asignation_char'],
//                     admited_value['string'],
//                     delimiter_characters['end_line_char']
//                 ]
//             ]
//         },
//         boolean_variable_definition: {
//             name: 'boolean_variable_definition',
//             type: 'variable',
//             patterns: [
//                 [
//                     varibles_typos['boolean'],
//                     admited_value['common_name'],
//                     delimiter_characters['asignation_char'],
//                     admited_value['boolean'],
//                     delimiter_characters['end_line_char']
//                 ]
//             ]
//         },
//         function_declaration: {
//             name: 'boolean_variable_definition',
//             type: 'variable',
//             patterns: [
//                 [
//                     varibles_typos['boolean'],
//                     admited_value['common_name'],
//                     delimiter_characters['asignation_char'],
//                     admited_value['boolean'],
//                     delimiter_characters['end_line_char']
//                 ]
//             ]
//         }
//     }

// }

/** AUTOMATONS */




validateBtn.addEventListener('click', () => {
    const codeAsArray = []
    for (let i = 0; i < editor.children.length; i++) {
        codeAsArray.push(editor.children[i].textContent)
    }
    validar(codeAsArray)
})

/** @param {KeyboardEvent} e  */
function keyDown(e) {
    // embConsole.textContent = e.key
    if (e.key === "Enter") {
        e.preventDefault()
        add_new_paragraph(e.target)
    }
    if (e.key === "Backspace" && e.target.textContent === "" && e.target.getAttribute("line") !== "1") {
        e.target.previousElementSibling.focus()
        editor.removeChild(e.target)
        updateLineCount()
    }
    if (e.key === "ArrowDown") { // Arrow down
        if (e.target.nextSibling) {
            e.target.nextSibling.focus()
            const currentCaretPosition = window.getSelection().focusOffset
            const selection = new Range()
            selection.setStart(e.target.nextSibling, 0)
            selection.setEnd(e.target.nextSibling, 0)
        }
    }

    if (e.key === "ArrowUp") { // Arrow up
        if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus()
            const selection = new Range()
            selection.setStart(e.target.previousElementSibling, 0)
            selection.setEnd(e.target.previousElementSibling, 0)
        }
    }
}

function add_new_paragraph(currentParagraph) {
    const paragraph = document.createElement("div");
    paragraph.setAttribute('line', editor.children.length + 1)
    paragraph.contentEditable = true;
    if (currentParagraph) {
        editor.insertBefore(paragraph, currentParagraph.nextSibling)
    } else {
        editor.appendChild(paragraph)
    }
    paragraph.addEventListener('keydown', (e) => keyDown(e))
    paragraph.focus()

    updateLineCount()
}

function updateLineCount() {
    const childsInEditor = editor.children
    for (let i = 0; i < childsInEditor.length; i++) {
        childsInEditor[i].setAttribute('line', i + 1)
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


loadEditor()

const codes = [
    [
        'num age: 12;',
        'str name: "Jose"',
        'bool wrong: 23;',
        'str age: "12";',
        'fn str(){',
        '    num a: 12;',
        '}',
        'fn cool(int a, str b, bool a):void{',
        '    a',
        '}'
    ],
    [
        'num years: 123;',
        'str currentMonth: "March";',
        'bool isFinite: true;',
        'fn doSomething(): void{',
        '    str years: "yep";',
        '    num uniqueVar: 12;',
        '    fn otherFunction(): num{',
        '        num uniqueVar: 14;',
        '    }',
        '}',
        'bool uniqueVar: false;',
        'if 12 == 12 {',
        '    bool uniqueVar: false;',
        '}',
        'if "uniqueVar" == "years" {',
        '}'
    ],
    [
        'num numero: 1;'
    ],
    [
        'num numero: true;'
    ],
    [
        'num numero: "asd";'
    ],
    [
        'num          a:12;',
        'str b   : "Aldo"       ;',
        'bool c: false;',
        'fn sumar(   num primerDigito   , num segundoDigito   ) :void ',
        '{',
        '    num d: 14.0;',
        '    num da: 16.0;',
        '    str e: "Alda";',
        '    if d>da{',
        '        bool c: true;',
        '    }',
        '}',
        'num d : 10;',
        'if "aldo"    =="eldo"{',
        '    str e : "pepe";',
        '}',
        'for(foo: 1   , foo< 5,foo++){',
        '    str f    :"pepeCruz";',
        '    for   ( a:12,a >12,a++){',
        '        num teve1: 14;',
        '    }}',
        'fn mehMeh():void{',
        '    ',
        '}',
    ],[
        'num b: 12;',
        'str c: "amigo";',
        'bool coyar: true;',
        'fn sumar(num add, num b): void{',
        '    str pepe: "cruz";',
        '}',
    ]
]



























// function inputHandler() {

//     if (editor.children.length == 0) {
//         emptyInputHandler()
//     }
//     removeWhiteSpace()

//     if (window.getSelection().focusNode.nodeName === "#text") {
//         if (!window.getSelection().focusNode.parentNode.classList.contains("active")) {
//             window.getSelection().focusNode.parentNode.classList.add("active")
//         }
//     }

//     for (let i = 0; i < editor.children.length; i++) {
//         editor.children[i].setAttribute("line", i + 1)
//     }

// }

// function keyPressHandler(e) {
//     if (e.key === "Enter" && editor.children.length === 1) {
//         editor.children[0].classList.add("active")
//     }

//     if(e.key === "Escape"){
//         if(window.getSelection().focusNode.nodeName === "#text"){
//             let b = window.getSelection().focusNode.textContent.split(" ")
//             let a = document.createElement('div')
//             for(let i = 0; i < b.length; i ++){
//                 let span = document.createElement('span')
//                 span.classList.add("red")
//                 span.textContent = b[i] + " "
//                 a.appendChild(span)
//             }

//             let ass = window.getSelection().focusOffset
//             window.getSelection().focusNode.parentNode.innerHTML = a.innerHTML
//             const sel = new Range()
//             sel.setStart(window.getSelection().focusNode.parentNode, ass)
//             console.log(window.getSelection().focusOffset)
//         }
//     }
// }

// function emptyInputHandler() {
//     const div = document.createElement('div')
//     div.setAttribute("line", editor.children.length + 1);
//     div.textContent = "."
//     div.setAttribute('placeholder', "Haz click acá para comenzar...")
//     editor.textContent = ""
//     editor.appendChild(div)
//     const selection = new Range()
//     selection.setStart(div, 0)
//     selection.setEnd(div, 1)
//     selection.deleteContents()
// }

// function removeWhiteSpace() {
//     if (window.getSelection().focusNode.childNodes.length > 0) {
//         let itemsToDelete = []
//         for (let i = 0; i < window.getSelection().focusNode.childNodes.length; i++) {
//             if (window.getSelection().focusNode.childNodes[i].nodeName === "BR") {
//                 itemsToDelete.push(window.getSelection().focusNode.childNodes[i])
//             }
//         }
//         for (let j = 0; j < itemsToDelete.length; j++) {
//             window.getSelection().focusNode.removeChild(itemsToDelete[j])
//         }
//     }
// }

// function colorizedText(){
//     const node = window.getSelection().focusNode

//     if(node.nodeName === "#text"){
//         let text = node.textContent.split(" ")
//         text.map((word)=>{
//             console.log(word)
//         })
//     }
// }