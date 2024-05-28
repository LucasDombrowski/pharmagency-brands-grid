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
    pagemarquesCheckAction(e, () => {
        pagemarquesDisplayElement(colors);
        pagemarquesDisplayElement(categories);
    }, () => {
        pagemarquesHideElement(colors);
        pagemarquesHideElement(categories);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryInput = document.getElementById("pagemarques_settings[pagemarques_categories]");
    const paginationInputs = document.querySelectorAll("input[name='pagemarques_settings[pagemarques_loading]']");

    function checkPaginationInput() {
        const paginationInputId = "pagemarques_settings[pagemarques_loading]-pagination";
        const el = document.getElementById("pagemarques-pagination-limit-input");
        
        let isChecked = false;
        paginationInputs.forEach((input) => {
            if (input.id === paginationInputId && input.checked) {
                isChecked = true;
            }
        });

        if (isChecked) {
            pagemarquesDisplayElement(el);
        } else {
            pagemarquesHideElement(el);
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
