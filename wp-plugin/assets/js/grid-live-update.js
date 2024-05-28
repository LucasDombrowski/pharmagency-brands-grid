function pagemarquesChangeGridColumn(n) {
    const grid = document.getElementById("pagemarques-grid");
    grid.style.gridTemplateColumns = `repeat(${n},1fr)`;
}

function pagemarquesChangeImagesSize(columns, size) {
    const grid = document.getElementById("pagemarques-grid");
    grid.style.maxWidth = `${columns * size}px`;
}

function pagemarquesChangeColors(primaryColor, secondaryColor) {
    const categoryListItems = document.querySelectorAll(".pagemarques-category-list-item");
    const categorySelect = document.getElementById("pagemarques-category-select");
    const paginationButtons = document.querySelectorAll(".pagemarques-pagination-button");
    const paginationIndex = document.getElementById("pagemarques-pagination-index");
    if (categoryListItems) {
        for (let categoryListItem of categoryListItems) {
            categoryListItem.style.color = primaryColor;
        }
    }
    if (categorySelect) {
        categorySelect.style.background = secondaryColor;
        categorySelect.style.color = primaryColor;
        categorySelect.style.borderColor = primaryColor;
    }
    if (paginationButtons) {
        for (let paginationButton of paginationButtons) {
            paginationButton.style.color = primaryColor;
            paginationButton.style.background = secondaryColor;
            paginationButton.style.borderColor = primaryColor;
        }
    }
    if (paginationIndex) {
        paginationIndex.style.color = primaryColor;
        paginationIndex.style.background = secondaryColor;
        paginationIndex.style.borderColor = primaryColor;
    }
}

function pagemarquesGetDefaultClass(el,value){
    return el.className.replace(value,"");
}

function pagemarquesChangeClass(el, defaultClass, value){
    el.className = defaultClass + " " + value;
}



document.addEventListener("DOMContentLoaded", () => {
    const gridColumnInput = document.getElementById("pagemarques_settings[pagemarques_columns]");
    const imageSizeInput = document.getElementById("pagemarques_settings[pagemarques_imageSize]");
    const primaryColorInput = document.getElementById("pagemarques_settings[pagemarques_primaryColor]");
    const secondaryColorInput = document.getElementById("pagemarques_settings[pagemarques_secondaryColor]");
    const classInputs = {
        grid: {
            input: document.getElementById("pagemarques_settings[pagemarques_cssClasses][grid_container]"),
            query: document.querySelectorAll("#pagemarques-grid")
        },
        item: {
            input: document.getElementById("pagemarques_settings[pagemarques_cssClasses][image_container]"),
            query: document.querySelectorAll(".pagemarques-grid-item")
        },
        image: {
            input: document.getElementById("pagemarques_settings[pagemarques_cssClasses][image]"),
            query: document.querySelectorAll(".pagemarques-grid-item-image")
        }
    };

    function pagemarquesSetDefaultClasses(){
        classInputs.grid.default = pagemarquesGetDefaultClass(classInputs.grid.query[0],classInputs.grid.input.value);
        classInputs.item.default = pagemarquesGetDefaultClass(classInputs.item.query[0],classInputs.item.input.value);
        classInputs.image.default = pagemarquesGetDefaultClass(classInputs.image.query[0],classInputs.image.input.value);
    }


    function pagemarquesColorInputChangeEvent() {
        pagemarquesChangeColors(primaryColorInput.value, secondaryColorInput.value);
    }

    pagemarquesSetDefaultClasses();

    gridColumnInput.addEventListener("change", (e) => {
        pagemarquesChangeGridColumn(e.target.value);
        pagemarquesChangeImagesSize(e.target.value, imageSizeInput.value)
    });

    imageSizeInput.addEventListener("change", (e) => {
        pagemarquesChangeImagesSize(gridColumnInput.value, e.target.value);
    });

    primaryColorInput.addEventListener("change", pagemarquesColorInputChangeEvent);

    secondaryColorInput.addEventListener("change", pagemarquesColorInputChangeEvent);

    for(let value of Object.values(classInputs)){
        value.input.addEventListener("change",(e)=>{
            console.log(value.query);
            for(let el of value.query){
                pagemarquesChangeClass(el,value.default,e.target.value);
            }
        });
    }
});
