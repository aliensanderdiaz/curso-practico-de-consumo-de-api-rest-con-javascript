const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
})


// utils

function createMovies(movies, container) {
    container.innerHTML = ''
    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path)

        movieContainer.appendChild(movieImg)

        container.appendChild(movieContainer)
    });
}

function createCategories(categories, container) {
    container.innerHTML = ''

    categories.forEach(categorie => {
        const categorieContainer = document.createElement('div')
        categorieContainer.classList.add('category-container')

        const categorieTitle = document.createElement('h3')
        categorieTitle.classList.add('category-title')
        categorieTitle.setAttribute('id', 'id' + categorie.id)

        categorieTitle.addEventListener('click', () => {
            location.hash = '#category=' + categorie.id + '-' + categorie.name
        })
        
        const categoryTitleText = document.createTextNode(categorie.name)

        categorieTitle.appendChild(categoryTitleText)
        categorieContainer.appendChild(categorieTitle)
        container.appendChild(categorieContainer)
    });
}

// API


async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day' )

    const movies = data.results

    console.log({
        data, movies
    })

    createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list')

    const categories = data.genres

    console.log({
        data, categories
    })

    createCategories(categories, categoriesPreviewList)
}


async function getMoviesByCategory(genre_id) {
    window.scrollTo(0,0)
    const { data } = await api('discover/movie', {
        params: {
            with_genres: genre_id 
        }
    })

    const movies = data.results

    console.log({
        data, movies
    })

    createMovies(movies, genericSection)
}


async function getMoviesBySearch(query) {
    window.scrollTo(0,0)
    const { data } = await api('search/movie', {
        params: {
            query
        }
    })

    const movies = data.results

    console.log({
        data, movies
    })

    createMovies(movies, genericSection)
}


async function getTrendingMovies() {
    const { data } = await api('trending/movie/day' )

    const movies = data.results

    console.log({
        data, movies
    })

    createMovies(movies, genericSection);
}


async function getMovie( id ) {
    const { data: movie } = await api('movie/' + id )

    console.log({ movie })

    movieDetailTitle.innerHTML = movie.title
    movieDetailDescription.innerHTML = movie.overview
    movieDetailScore.innerHTML = movie.vote_average

    
    headerSection.style.backgroundImage = 'linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(' + 'https://image.tmdb.org/t/p/w500' + movie.poster_path + ')'

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMovies( id )

}

async function getRelatedMovies( id ) {
    const { data } = await api('movie/' + id +'/similar' )

    const movies = data.results

    console.log({
        data, movies
    })

    createMovies(movies, relatedMoviesContainer);

}