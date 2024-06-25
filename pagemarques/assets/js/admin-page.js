
function pagemarquesDisplayElement(el) {
    el.classList.remove("pagemarques-hidden");
    el.classList.remove("hidden");
}

function pagemarquesHideElement(el) {
    el.classList.add("pagemarques-hidden");
    el.classList.add("hidden");
}

function pagemarquesCheckAction(event, onCheck, onUncheck) {
    if (event.target.checked) {
        onCheck();
    } else {
        onUncheck();
    }
}

function syncHexColor(inputId) {
    var colorPicker = document.getElementById(inputId);
    var hexInput = document.getElementById(inputId + '_hex');
    hexInput.value = colorPicker.value;
}

function syncColorPicker(inputId) {
    var hexInput = document.getElementById(inputId + '_hex');
    var colorPicker = document.getElementById(inputId);

    if (/^#([A-Fa-f0-9]{6})$/.test(hexInput.value)) {
        colorPicker.value = hexInput.value;
    }
}

function pagemarquesCopyCode() {
    // Get the code snippet text
    var code = document.getElementById("codeSnippet").innerText;

    // Create a temporary textarea element to copy the text
    var textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand("copy");

    // Remove the temporary textarea element
    document.body.removeChild(textarea);

    // Show the tooltip
    var tooltip = document.getElementById("tooltip");
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";

    // Hide the tooltip after a short delay
    setTimeout(function () {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }, 1000);
}

function pagemarquesCategoryCheckAction(e) {
    const colors = document.getElementById("pagemarques-main-colors");
    const categories = document.getElementById("pagemarques-category-list");
    const labelClassInput = document.getElementById("pagemarques_settings[pagemarques_cssClasses][category_label]").parentElement;
    pagemarquesCheckAction(e, () => {
        pagemarquesDisplayElement(colors);
        pagemarquesDisplayElement(categories);
        pagemarquesDisplayElement(labelClassInput);
    }, () => {
        pagemarquesHideElement(colors);
        pagemarquesHideElement(categories);
        pagemarquesHideElement(labelClassInput);
    });
}

function pagemarquesResetGrid() {
    const grid = document.getElementById("pagemarques-grid");
}


document.addEventListener('DOMContentLoaded', () => {
    const categoryInput = document.getElementById("pagemarques_settings[pagemarques_categories]");
    const paginationInputs = document.querySelectorAll("input[name='pagemarques_settings[pagemarques_loading]']");
    const code = document.getElementById("code-container");

    function checkPaginationInput() {
        const paginationInputId = "pagemarques_settings[pagemarques_loading]-pagination";
        const el = document.getElementById("pagemarques-pagination-limit-input");
        const buttonClassInput = document.getElementById("pagemarques_settings[pagemarques_cssClasses][pagination_button]").parentElement;
        const indexClassInput = document.getElementById("pagemarques_settings[pagemarques_cssClasses][pagination_index]").parentElement;

        let isChecked = false;
        paginationInputs.forEach((input) => {
            if (input.id === paginationInputId && input.checked) {
                isChecked = true;
            }
        });

        if (isChecked) {
            pagemarquesDisplayElement(el);
            pagemarquesDisplayElement(buttonClassInput);
            pagemarquesDisplayElement(indexClassInput);
        } else {
            pagemarquesHideElement(el);
            pagemarquesHideElement(buttonClassInput);
            pagemarquesHideElement(indexClassInput);
        }
    }

    if (categoryInput) {
        categoryInput.addEventListener("change", pagemarquesCategoryCheckAction);
        pagemarquesCategoryCheckAction({
            target: {
                checked: categoryInput.checked
            }
        });
    }

    if (paginationInputs) {
        paginationInputs.forEach((input) => {
            input.addEventListener("change", checkPaginationInput);
        });
        checkPaginationInput();  // Ensure the correct state on page load
    }

    code.addEventListener("click", pagemarquesCopyCode);
});
