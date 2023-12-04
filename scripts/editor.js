const editor = document.getElementById("editor")
const autocode = document.getElementById("autocode")
const validateBtn = document.getElementById('validate')
const deleteBtn = document.getElementById('borrar')
const out = document.getElementById('output')
const stack = document.getElementById('stack')

deleteBtn.addEventListener('click', () => {
    editor.innerHTML = ""
    add_new_paragraph()
})

function loadEditor() {
    stack.innerHTML = ""
    out.innerHTML = ""
    editor.innerHTML = ""
    add_new_paragraph()
    autocode.addEventListener('click', () => {
        loadPreBuildCode()
    })
}

function loadPreBuildCode() {
    const selectedCode = test_data[randomIntFromInterval(0, test_data.length - 1)]
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

validateBtn.addEventListener('click', () => {
    const codeAsArray = []
    for (let i = 0; i < editor.children.length; i++) {
        codeAsArray.push(editor.children[i].textContent)
    }
    start(codeAsArray)
})

function keyDown(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        add_new_paragraph(e.target)
    }
    if (e.key === "Backspace" && e.target.textContent === "" && e.target.getAttribute("line") !== "1") {
        e.target.previousElementSibling.focus()
        editor.removeChild(e.target)
        updateLineCount()
    }
    if (e.key === "ArrowDown") {
        if (e.target.nextSibling) {
            e.target.nextSibling.focus()
            const currentCaretPosition = window.getSelection().focusOffset
            const selection = new Range()
            selection.setStart(e.target.nextSibling, 0)
            selection.setEnd(e.target.nextSibling, 0)
        }
    }

    if (e.key === "ArrowUp") {
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

const codes = [
    [
        'num x: 5;',
        'str y: "Hello";',
        'bool z: false;',
        'fn multiply(num a, num b):num{',
        '    return result;',
        '},',
        'fn greet(str name):void{',
        '    str greeting: "Hello";',
        '}',
        'if count > 10{',
        '    str message: "Count is greater than 10";',
        '},',
        'for (i: 0, i < 5, i++){',
        '},',
        'for (j: 10, j > 0, j--){',
        '}'
    ],
    [
        'num a: 12;',
        'num b: 12.12;',
        'str c: "Some text";',
        'bool d: true;',
        'fn sumar(num a, num b):void{',
        '    str b: true;',
        '},',
        'fn sumar():num{',
        '    str b: true;',
        '},',
        'if 1 < 1{',
        '    str b: true;',
        '},',
        'if varname > namevar{',
        '    str b: true;',
        '},',
        'if "varname" == "namevar"{',
        '    str b: true;',
        '},',
        'if "varname" != 12{',
        '    str b: true;',
        '},',
        'for (alumno:0, alumno < 30, alumno++){',
        '    str b: true;',
        '},',
        'for (alumno, alumno > 30, alumno--){',
        '    str b: true;',
        '}'
    ],
    [
        'num a: 12;',
        'str b: "Aldo";',
        'bool c: false;',
        'fn sumar(num primerDigito, num segundoDigito):void {',
        '    num d: 14.0;',
        '    num da: 16.0;',
        '    str e: "Alda";',
        '    if d > da {',
        '        bool c: true;',
        '    }',
        '}',
        'num d: 10;',
        'if aldo == eldo {',
        '    str e: "pepe";',
        '}',
        'for (foo: 1, foo < 5, foo++) {',
        '    str f: "pepeCruz";',
        '    for (a: 12, a > 12, a++) {',
        '        num teve1: 14;',
        '    }',
        '}',
        'fn mehMeh():void {',
        '    ',
        '}',
    ]
    , [
        'num b: 12;',
        'str c: "amigo";',
        'bool coyar: true;',
        'fn sumar(num add, num b): void{',
        '    str pepe: "cruz";',
        '}',
    ],
    [
        'num x: 5;',
        'str y: "Hello";',
        'bool z: false;',
        'fn multiply(num a, num b):num{',
        '    num result: a * b;',
        '    return result;',
        '},',
        'fn greet(str name):void{',
        '    str greeting: "Hello, " + name + "!";',
        '},',
        'if count > 10{',
        '    str message: "Count is greater than 10";',
        '},',
        'for (i: 0, i < 5, i++){',
        '},',
        'for (j: 10, j > 0, j--){',
        '}'
    ],
]

const test_data = [
    // [
    //     'num hola: 12;',
    //     'num mundo: 122;',
    //     'str como: "Sometext";',
    //     'bool estamos: true;'
    // ],
    // [
    //     'num a: "Sometext"  ;',
    //     'str b: true  ;',
    //     'bool c: 12 ;',
    //     'bool c: .12 ;'
    // ],
    // [
    //     'fn sumar(num a, num b):void{',
    //     '   str b: true  ;',
    //     '}',
    //     'fn sumar():num{',
    //     '   str b: true  ;',
    //     '}',
    // ],
    // [
    //     'if ola < alo{',
    //     '   bool b: true  ;',
    //     '}',
    //     'if varname > namevar{',
    //     '   str b: "true"  ;',
    //     '}',
    //     'if varname == namevar{',
    //     '   num b: 12  ;',
    //     '}',
    // ],
    // [
    //     'for (alumno:0, alumno < 30, alumno++){',
    //     '   str b: true  ;',
    //     '}',
    //     'for (alumno, alumno > 30, alumno--){',
    //     '   str b: true  ;',
    //     '}'
    // ],
    [
        "if alo < ola {",
        "    bool a: true;",
    ]
]



setTimeout(() => {
    loadPreBuildCode()
    const codeAsArray = []
    for (let i = 0; i < editor.children.length; i++) {
        codeAsArray.push(editor.children[i].textContent)
    }
    start(codeAsArray)
}, 200)