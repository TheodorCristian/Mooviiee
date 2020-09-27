//API key : a8904b4c

const autoCompleteConfig = {
//Setting how to render the result
renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
    `
},

// Setting the title of the selected option into the input
inputValue: (movie) => {
    return movie.Title;
},
// Searching for the results making a http request to the api with the info typed into the input
async fetchData (search) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'a8904b4c',
                s: search
            }
        });
        if(response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
}
createAutoComplete({
    //spreading all the key-value pairs from the autoComplete Confing, because those properties are reusable between the all autocompletes that we might want to create
    ...autoCompleteConfig,

    //Setting where to render the results
    rootElement: document.querySelector('#left-autocomplete'),

    //What to do when someone clicks on one option
    onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');

    //Setting the location of the detailed results are shown into the html 
    movieSelected(movie, document.querySelector('#left-summary'), 'left');
},
}); 
createAutoComplete({
    ...autoCompleteConfig,
    rootElement: document.querySelector('#right-autocomplete'), 
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden');
        movieSelected(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const movieSelected = async (movie, summaryTarget, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'a8904b4c',
            i: movie.imdbID
        }
    });
    summaryTarget.innerHTML = movieLayout(response.data);

    if ( side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if ( leftMovie && rightMovie) {
        runComparison();
    }
};

runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
    
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        if (leftSideValue > rightSideValue) {
            rightStat.classList.remove('is-primary');rightStat.classList.add('is-warning');
        } else {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    });

     
}

const movieLayout = (movieDetails) => {
    //parsing into integer the boxOffice so it can be compared between movies
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

    //parsing the metascore into integer so it can be compared with other metascore
    const metascore = parseInt(movieDetails.Metascore);

    //parsing the imdbRating into float so it can be compared with the other one
    const imdbRating = parseFloat(movieDetails.imdbRating);

    //parsing the imdbVotes into integer so it can be compared as well
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

    //Taking out the number of awards so we can decide which movie is better
    //Using reduce, we will compare every words and see if they're numbers. if it finds a number, it stores it as "prev", when encounters a string which is NaN, returns the "prev", but if encounters a number, it sums the prev with the actual number and returns and sets the result sum to the actual prev. 
    const awards = movieDetails.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word); 
        if(isNaN(value)) {
            return prev;
        }
        return prev + value;
    }, 0);
    
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetails.Poster}">
            </p>
        </figure>
        <div class="content">
            <h1>${movieDetails.Title}</h1>
            <h4>${movieDetails.Genre}</h4>
            <p>${movieDetails.Plot}</p>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}
