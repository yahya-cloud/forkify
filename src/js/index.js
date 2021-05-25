import Search from "./models/Search"
import * as SearchView from "./views/SearchView"
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base"
import Recipe from "./models/Recipe"
import List from "./models/List"
import * as listView from "./views/listView"
import * as recipeView from './views/recipeView'
import Like from "./models/Likes"
import * as likesView from "./views/likesView"

/**Global state of the app 
 *- Search object
 *- Current recipe object
 *- Current List Object
 *- Liked recipe's
 */
const state = {}


/**
SEARCH CONTROLLER 
**/

const controlSearch = async () => {
    //1) Get query from view
    const query = SearchView.getInput()

    
    if (query) {
        //2)Make new Search object and add to state
        state.search = new Search(query);
       

        //3)Prepare UI for Results
        SearchView.clearFields()
        renderLoader(elements.searchRes)

        try {
            //4)Search for recipes
            await state.search.getResult()
            clearLoader()

            //5)Show result in UI
            SearchView.renderResult(state.search.result);
        } catch (err) {
            console.log(err);
            alert(err);
        }


    }
}

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        SearchView.clearFields()
        SearchView.renderResult(state.search.result, goToPage);
    }

})

/**
RECIPE CONTROLLER 
**/
const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#','');

    if (id) {
        //Prepare Ui for Changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        //Highlight selected search item
        if (state.search)
            SearchView.highlightSelected(id)

        //Create new recipe object
        state.recipe = new Recipe(id);
       


        try {
            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients()

            //Calculate Servings and time
            state.recipe.calcTime();
            state.recipe.calcServings()

            //Display servings to the UI
            clearLoader()
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id))
         



        } catch (err) {
            console.log(err);
            alert("something went wrong :(")
        }
    }
}

['load', 'hashchange'].forEach(event => window.addEventListener(event, controlRecipe))


/**
LIST CONTROLLER 
**/
const controlList = () => {
    //Creating a new list if there isn't one
    if (!state.list) state.list = new List()

    //Adding items to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderItem(item)
    });
}


//Handel delete and update list items events
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    if(e.target.matches('.shopping__delete, .shopping__delete *')){

    //deleting from state
    state.list.deleteItem(id)

    //deleting from the UI
    listView.deleteItem(id)

    //Handel the count update 
    }else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }

    
})


/**
CONTROL CONTROLLER 
**/
///////////////



//Restore likes when page load
window.addEventListener('load', () => {
    state.likes = new Like()

    //Restore likes
    state.likes.readStorage()

    //Toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumLikes())

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))

}) 

const controlLikes = () => {

    
    if(!state.likes) state.likes = new Like();
    const currentId = state.recipe.id;

    //User has not yet liked the current Id
    if(!state.likes.isLiked(currentId)){
        //Add like to the State
      const newLike =  state.likes.addLike(
          currentId, 
          state.recipe.title,
          state.recipe.author,
          state.recipe.img
      );
      //Toggle the Like button
      likesView.toggleLikeButton(true)

      //Display like to the UI
      likesView.renderLike(newLike)
     
    }else {
        state.likes.deleteLike(currentId)

        //Toggle Like button
        likesView.toggleLikeButton(false) 

        //Remove like from the UI
        likesView.deleteLike(currentId)
     
    }
}



//Handling recipe button clicks
elements.recipe.addEventListener("click", e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {

        //Decrease button is clicked
        if (state.recipe.servings > 1)
            state.recipe.updateServing('dec')
        recipeView.updateServingsIngredients(state.recipe)

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {

        //Increase button is clicked
        state.recipe.updateServing('inc')
        recipeView.updateServingsIngredients(state.recipe)

        //Adding to list
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList()

        //Adding to likes List
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes()
    }
    likesView.toggleLikesMenu(state.likes.getNumLikes())
})