import {elements} from "./base"

export const getInput = () => elements.searchInput.value

export const clearFields = () => {
    elements.searchInput.value = ' ';
    elements.searchResList.innerHTML = ' '
    elements.searchResPages.innerHTML = ' '
};


export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el =>{
        el.classList.remove('results__link--active')
    })

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active')
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) =>{
           if(acc + cur.length <= limit){
               newTitle.push(cur)
           }
           return acc + cur.length
        },0)
        return `${newTitle.join(' ')}....`
    }
    return title
};



 const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src=${recipe.image_url} alt=${recipe.title}>
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li> ` 
elements.searchResList.insertAdjacentHTML("beforeend", markup)
}

const createButton = (page, type) => 
    `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1} >
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>
    `;
 
    




export const renderButtons = (page, numOfResult, resPerPage) => {
    const  pages = Math.ceil(numOfResult / resPerPage);

    let button;
    if(page === 1 && pages > 1){
        //Only display button to go to next page 
        button = createButton( page, 'next');
    }else if(page < pages){
        //Both buttons
        button = `
        ${createButton( page, 'prev')}
        ${createButton( page, 'next')}
        `
    }else if(page === pages && pages > 1){
        //Ony show the button to go to the previous page
        button = createButton(page, 'prev')
    }
   
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipes, page = 1, resPerPage = 10 ) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage
   recipes.slice(start, end).forEach(renderRecipe);
   renderButtons(page, recipes.length, resPerPage )
}