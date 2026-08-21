/* =====================================
   ONE TIME DOCS
   Main JavaScript
===================================== */


const editor = document.getElementById("document");


let currentOrientation = "portrait";


let currentPageSize = "A4";


let currentMargin = 25;




/* =====================================
   EDITOR
===================================== */


function format(command, value = null) {


    editor.focus();


    document.execCommand(command, false, value);


}




/* =====================================
   UNDO / REDO
===================================== */


function undo() {


    editor.focus();


    document.execCommand("undo");


}




function redo() {


    editor.focus();


    document.execCommand("redo");


}




/* =====================================
   FONT SIZE
===================================== */


function changeFontSize(size) {


    editor.focus();


    document.execCommand(
        "fontSize",
        false,
        size
    );


}




/* =====================================
   HEADINGS
===================================== */


function applyHeading(tag) {


    if (!tag) {


        document.execCommand(
            "formatBlock",
            false,
            "p"
        );


        return;
    }


    document.execCommand(
        "formatBlock",
        false,
        tag
    );


}




/* =====================================
   CUSTOM FONT
===================================== */


function addFont() {


    document.getElementById("fontInput").click();


}




document
    .getElementById("fontInput")
    .addEventListener("change", function () {


        const file = this.files[0];


        if (!file) {
            return;
        }


        const fontName =
            "CustomFont_" +
            Date.now();




        const fontURL =
            URL.createObjectURL(file);




        const style =
            document.createElement("style");




        style.innerHTML = `
            @font-face {
                font-family: "${fontName}";
                src: url("${fontURL}");
            }
        `;




        document.head.appendChild(style);




        const option =
            document.createElement("option");




        option.value = fontName;


        option.textContent =
            file.name;




        document
            .getElementById("fontFamily")
            .appendChild(option);




        document
            .getElementById("fontFamily")
            .value = fontName;




        editor.focus();




        document.execCommand(
            "fontName",
            false,
            fontName
        );


});




/* =====================================
   PAGE SETTINGS
===================================== */


function openSettings() {


    document.getElementById(
        "settingsModal"
    ).style.display = "flex";


}




function closeSettings() {


    document.getElementById(
        "settingsModal"
    ).style.display = "none";


}




/* =====================================
   PAGE SIZE
===================================== */


function changePageSize() {


    currentPageSize =
        document.getElementById(
            "pageSize"
        ).value;




    const sizes = {


        A4: {
            width: "210mm",
            height: "297mm"
        },


        A5: {
            width: "148mm",
            height: "210mm"
        },


        Letter: {
            width: "216mm",
            height: "279mm"
        },


        Legal: {
            width: "216mm",
            height: "356mm"
        }


    };




    const size =
        sizes[currentPageSize];




    if (currentOrientation === "portrait") {


        editor.style.width =
            size.width;


        editor.style.minHeight =
            size.height;


    } else {


        editor.style.width =
            size.height;


        editor.style.minHeight =
            size.width;


    }


}




/* =====================================
   ORIENTATION
===================================== */


function setOrientation(orientation) {


    currentOrientation =
        orientation;




    changePageSize();


}




/* =====================================
   MARGIN
===================================== */


function changeMargin() {


    currentMargin =
        document.getElementById(
            "margin"
        ).value;




    document.getElementById(
        "marginValue"
    ).textContent =
        currentMargin + " mm";




    editor.style.padding =
        currentMargin + "mm";


}




/* =====================================
   PDF DOWNLOAD
===================================== */


function downloadPDF() {


    const oldShadow =
        editor.style.boxShadow;




    editor.style.boxShadow = "none";




    const options = {


        margin: 0,


        filename:
            "One-Time-Document.pdf",


        image: {
            type: "jpeg",
            quality: 0.98
        },


        html2canvas: {


            scale: 2,


            useCORS: true


        },


        jsPDF: {


            unit: "mm",


            format:
                getPDFPageSize(),


            orientation:
                currentOrientation


        }


    };




    html2pdf()


        .set(options)


        .from(editor)


        .save()


        .then(() => {


            editor.style.boxShadow =
                oldShadow;


        });


}




/* =====================================
   PDF PAGE SIZE
===================================== */


function getPDFPageSize() {


    const sizes = {


        A4: "a4",


        A5: "a5",


        Letter: "letter",


        Legal: "legal"


    };




    return sizes[currentPageSize] || "a4";


}




/* =====================================
   WORD DOWNLOAD
===================================== */


function downloadWord() {


    const content =
        editor.innerHTML;




    const html = `


        <!DOCTYPE html>


        <html>


        <head>


            <meta charset="UTF-8">


            <style>


                body {
                    font-family: Arial;
                    line-height: 1.6;
                }


            </style>


        </head>


        <body>


            ${content}


        </body>


        </html>


    `;




    const converted =
        htmlDocx.asBlob(html);




    const url =
        URL.createObjectURL(converted);




    const link =
        document.createElement("a");




    link.href = url;


    link.download =
        "One-Time-Document.docx";




    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);




    URL.revokeObjectURL(url);


}




/* =====================================
   CLOSE MODAL BY CLICKING OUTSIDE
===================================== */


document
    .getElementById("settingsModal")
    .addEventListener(
        "click",
        function (event) {


            if (
                event.target === this
            ) {


                closeSettings();


            }


        }
    );




/* =====================================
   KEYBOARD SHORTCUTS
===================================== */


document.addEventListener(
    "keydown",
    function (event) {


        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "b"
        ) {


            event.preventDefault();


            format("bold");


        }




        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "i"
        ) {


            event.preventDefault();


            format("italic");


        }




        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "u"
        ) {


            event.preventDefault();


            format("underline");


        }


    }
);




/* =====================================
   INITIAL PAGE
===================================== */


changePageSize();


changeMargin();