import axios from "axios"

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (err) {
            console.log(err);
            alert(err)
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15
    }

    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'ozs', 'tsp', 'tsps', 'cup', 'pound']

        const newIngredients = this.ingredients.map(el => {
            //1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");

            //3)Parse ingredient into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
     

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                //Ex. 4 1/2 cups, arrCount ia [4, 1/2] ---> eval("4+1/2") ---> 4.5
                //Ex. 4cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex)

                let count;
                if (arrCount.length === 1) {
                    count =  (arrIng[0].replace('-', '+'))
                } else {
                    count =  eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex , 1).join(' ')
                }


            } else if (parseInt(arrIng[0], 10)) {
                //There is No unit, but 1st element is number

                objIng = {
                    count:  parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                //There is NO unit and No number in 1st position

                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            
            }
            return objIng;
        })
        this.ingredients = newIngredients
      

    }
    updateServing(type) {
        //Servings
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count  *= (newServing / this.servings) 
        })

        this.servings = newServing
    }
}