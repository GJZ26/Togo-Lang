const ligature_btn = document.getElementById("ligature-btn");
const editor = document.getElementById("editor")
const autocode = document.getElementById("autocode")
const validateBtn = document.getElementById('validate')
const deleteBtn = document.getElementById('borrar')
const out = document.getElementById('output')
const stack = document.getElementById('stack')

stack.textContent = ""
out.textContent = ""

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

deleteBtn.addEventListener('click', () => {
    editor.innerHTML = ""
    add_new_paragraph()
})

function loadEditor() {
    editor.innerHTML = ""
    add_new_paragraph()
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
        'str numero: "Hola mundo";'
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
        'if aldo    == eldo{',
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


loadPreBuildCode()
const codeAsArray = []
for (let i = 0; i < editor.children.length; i++) {
    codeAsArray.push(editor.children[i].textContent)
}
validar(codeAsArray)