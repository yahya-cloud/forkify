import { elements } from './base'

export const toggleLikeButton = isLiked => {
    //icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
    
}

export const toggleLikesMenu = numLikes => {
    elements.likesMenu.style.opacity = numLikes > 0 ? 1 : 0
} 

export const renderLike = like => {
    const markUp = `
    <li>
    <a class="likes__link" href="${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.author}</p>
        </div>
    </a>
</li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markUp)
 
}

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
   if(el) el.parentElement.removeChild(el)
}