// de Editor.js
loadEditor()

function start(code_as_array) {

    const auto = new Automaton(
        parseInt(document.getElementById('speed').value),
        code_as_array,
        stack,
        out
    )
    
    auto.load()
    auto.start()
}