const pokemonContainer = document.getElementById('pokemon-container');
const spinner = document.getElementById('spinner');
const previous = document.getElementById('previous');
const next = document.getElementById('next');

let offset = 1;
let limit = 9;

async function fetchPokemon(id){
    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(res => res.json())
    .then(data => {
        createPokemon(data);
        spinner.style.display = 'none';
    });
}

async function fetchPokemons(offset, limit){ //offset : desde donde 
    spinner.style.display = 'block';
    for (let i = offset; i <= offset+ limit; i++) {
        await fetchPokemon(i);
    }
}

function createPokemon(pokemon){
    //Creo una FlipCard
    const flipCard = document.createElement('DIV');
    flipCard.classList.add('flip-card');

    const flipCardContainer = document.createElement('DIV');
    flipCardContainer.classList.add('flip-card-container');

    flipCard.appendChild(flipCardContainer)

    //CARD
    const card = document.createElement('DIV');
    card.classList.add('card-front');
    card.classList.add('card');


    //IMAGE
    const imgFrontContainer = document.createElement('DIV');
    imgFrontContainer.classList.add('img-container');

    const sprite = document.createElement('IMG')
    sprite.classList.add('card-img-top')
    sprite.src = pokemon.sprites.other.home.front_default;

    imgFrontContainer.appendChild(sprite);

    //BODY
    const bodyFrontContainer = document.createElement('DIV');
    bodyFrontContainer.classList.add('body');
    bodyFrontContainer.classList.add('card-body');

        //ID
    const number = document.createElement('P');
    number.textContent = `#${pokemon.id.toString().padStart(3,0)}`
    number.classList.add('card-text')
        //NAME
    const name = document.createElement('P')
    name.classList.add('pokemon-name');
    name.textContent = pokemon.name


    bodyFrontContainer.appendChild(name)
    bodyFrontContainer.appendChild(number)

    card.appendChild(imgFrontContainer)
    card.appendChild(bodyFrontContainer)

    //CardBack
    const cardBack = document.createElement('DIV');
    cardBack.classList.add('card-back');
    cardBack.appendChild(progressBar(pokemon.stats))

    flipCardContainer.appendChild(card)
    flipCardContainer.appendChild(cardBack)
    pokemonContainer.appendChild(flipCard);

}

function removeChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}

function progressBar(stats){
    const statContainers = document.createElement('DIV');
    statContainers.classList.add('stats-container');

    for (let i = 0; i < 6; i++) {
        const stat = stats[i]
        const statPercent = stat.base_stat / 2 + '%'

        if ( [3,4].includes(i)){
            continue
        }else{
            
            //Stat Container
            const statContainer = document.createElement('DIV')
            statContainer.classList.add('stat-container');

            //Stat Name
            const statName = document.createElement('DIV');
            statName.classList.add('stat-name')
            statName.textContent = stat.stat.name

            //Progress
            const progress = document.createElement('DIV')
            progress.classList.add('progress')

            //Progress Bar
            const progressBar = document.createElement('DIV')
            progressBar.classList.add('progress-bar');
            progressBar.setAttribute('aria-valuenow', stat.base_stat)
            progressBar.setAttribute('aria-valuemin', 0)
            progressBar.setAttribute('aria-valuemax', 200)
            progressBar.style.width = statPercent;

            progressBar.textContent = stat.base_stat;

            progress.appendChild(progressBar)
            statContainer.appendChild(statName)
            statContainer.appendChild(progress)
            statContainers.appendChild(statContainer)
        }

    }

    return statContainers
}
previous.addEventListener('click', ()=>{
    if ((offset - limit + 1) <= 0){
        offset = 1;
        removeChildNodes(pokemonContainer)
        fetchPokemons(offset,limit);
    }
    if(offset!= 1){
        offset -= (limit +1);
        removeChildNodes(pokemonContainer)
        fetchPokemons(offset,limit);
    }


});
next.addEventListener('click', ()=>{
    offset += (limit +1)
    removeChildNodes(pokemonContainer)
    fetchPokemons(offset,limit);
});

fetchPokemons(offset,limit);
