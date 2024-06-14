function pagemarquesChangeGridColumn(n) {
    const grid = document.getElementById("pagemarques-grid");
    const gridClone = document.getElementById("pagemarques-grid-clone");
    grid.style.gridTemplateColumns = `repeat(${n},1fr)`;
    if(gridClone){
        gridClone.style.gridTemplateColumns = `repeat(${n},1fr)`;
    }
}

function pagemarquesChangeGridGap(n){
    const grid = document.getElementById("pagemarques-grid");
    const gridClone = document.getElementById("pagemarques-grid-clone");
    grid.style.gap = n + "px"
    if(gridClone){
        gridClone.style.gridTemplateColumns = n + "px";
    }
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

function getCurrentGridItems(){
    const res = [];
    const items = document.querySelectorAll(".pagemarques-grid-item");
    for(let item of items){
        res.push(item.cloneNode(true));
    }
    return res;
}

function resetGridItems(items){
    const grid = document.getElementById("pagemarques-grid");
    const gridClone = grid.cloneNode(true);
    grid.style.display = "none";
    gridClone.innerHTML = "";
    gridClone.id = gridClone.id + "-clone";
    for(let item of items){
        gridClone.appendChild(item.cloneNode(true));
    }
    grid.insertAdjacentElement('afterend',gridClone);
    return gridClone;
}

function displayRealGrid(clone){
    const grid = document.getElementById("pagemarques-grid");
    if(clone !== null){
        clone.remove();
    }
    grid.style.display = "";
}


window.addEventListener("load", () => {
    const categoryInput = document.getElementById("pagemarques_settings[pagemarques_categories]");
    const gapInput = document.getElementById("pagemarques_settings[pagemarques_gridGap]");
    const gridColumnInputs = {
        "computer":document.getElementById("pagemarques_settings[pagemarques_columnsComputer]"),
        "tablet":document.getElementById("pagemarques_settings[pagemarques_columnsTablet]"),
        "mobile":document.getElementById("pagemarques_settings[pagemarques_columnsMobile]")
    };
    const imageSizeInput = document.getElementById("pagemarques_settings[pagemarques_imageSize]");
    const primaryColorInput = document.getElementById("pagemarques_settings[pagemarques_primaryColor]");
    const secondaryColorInput = document.getElementById("pagemarques_settings[pagemarques_secondaryColor]");
    const allBrands = getCurrentGridItems();
    var gridClone = null;

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
        },
        label: {
            input: document.getElementById("pagemarques_settings[pagemarques_cssClasses][category_label]"),
            query: document.querySelectorAll(".pagemarques-category-list-item")
        },
        button : {
            input: document.getElementById("pagemarques_settings[pagemarques_cssClasses][pagination_button]"),
            query: document.querySelectorAll(".pagemarques-pagination-button")
        },
        index : {
            input:  document.getElementById("pagemarques_settings[pagemarques_cssClasses][pagination_index]"),
            query: document.querySelectorAll("#pagemarques-pagination-index")
        }
    };

    function pagemarquesSetDefaultClasses(){
        for(let entry of Object.entries(classInputs)){
            if(entry[1]["query"][0] && entry[1]["query"][0] != undefined){
                classInputs[entry[0]]["default"] = pagemarquesGetDefaultClass(entry[1]["query"][0], entry[1]["input"].value)
            }
        }
    }


    function pagemarquesColorInputChangeEvent() {
        pagemarquesChangeColors(primaryColorInput.value, secondaryColorInput.value);
    }

    pagemarquesSetDefaultClasses();

    function pagemarquesGetResponsiveGridColumns(){
        if(window.screen.width < 500){
            return gridColumnInputs.mobile.value
        } else if(window.screen.width < 800){
            return gridColumnInputs.tablet.value
        } else {
            return gridColumnInputs.computer.value
        }
    }

    categoryInput.addEventListener("change",(e)=>{
        if(e.target.checked){
            displayRealGrid(gridClone);
        } else {
            gridClone = resetGridItems(allBrands);
        }
    });

    gapInput.addEventListener("change",(e)=>{
        pagemarquesChangeGridGap(e.target.value);
    })

    for(let gridColumnInput of Object.values(gridColumnInputs)){
        gridColumnInput.addEventListener("change", (e) => {
            const columns = pagemarquesGetResponsiveGridColumns();
            pagemarquesChangeGridColumn(columns);
            pagemarquesChangeImagesSize(columns, imageSizeInput.value)
        });
    }

    window.addEventListener("resize",()=>{
        pagemarquesChangeGridColumn(pagemarquesGetResponsiveGridColumns());
        pagemarquesChangeImagesSize(pagemarquesGetResponsiveGridColumns(),imageSizeInput.value);
    });

    imageSizeInput.addEventListener("change", (e) => {
        pagemarquesChangeImagesSize(pagemarquesGetResponsiveGridColumns(), e.target.value);
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
