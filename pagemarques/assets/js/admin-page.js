
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

function pagemarquesResetGrid(){
    const grid = document.getElementById("pagemarques-grid");
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryInput = document.getElementById("pagemarques_settings[pagemarques_categories]");
    const paginationInputs = document.querySelectorAll("input[name='pagemarques_settings[pagemarques_loading]']");

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
});
