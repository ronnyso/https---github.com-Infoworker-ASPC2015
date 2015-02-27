

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

var isKlingon = false;
var originalFont = undefined;

function toggleWookie() {
    if (!isKlingon) {
        originalFont = document.body.style.fontFamily;
        document.body.style.fontFamily = 'DistantGalaxySymbols'
    }
    else {
        document.body.style.fontFamily = originalFont;
    }
    isKlingon = !isKlingon;
}