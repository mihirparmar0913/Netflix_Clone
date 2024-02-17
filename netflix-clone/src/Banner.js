import React, { useEffect, useState } from 'react';
import axios from './Axios';
import requests from './request';
import './banner.css';

function Banner() {
  const [movie, setMovie] = useState(null);
const path = "https://image.tmdb.org/t/p/original";
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchNetflixOriginals);
        setMovie(request.data.results[Math.floor(Math.random() * request.data.results.length)]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  function truncateString(str, num) {
    if (!str) return '';
    if (str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  }
  const handleClick=(movie)=>{
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
      <button class="close">&times;</button>
      
      <img src="${path}/${movie.poster_path}" alt="${movie.title}" />
      <h2>${movie.title || movie.name}</h2>  
      <p>Rating: ${movie.vote_average}</p>
      <p>Popularity: ${movie.popularity}</p>
      <p>Release Date: ${movie?.first_air_date || movie?.release_date}</p>
      <p>Original Language: ${movie?.original_language}</p>
      <p>Overview: ${movie.overview}</p>
      </div>`;
      document.body.appendChild(modal);
     const closeButton = modal.querySelector(".close");
     closeButton.addEventListener("click", () => {
      modal.remove();
    });
  }
  return (
    <header
      className="banner"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: 'center center',
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner_button"  onClick={() => {
              handleClick(movie);
            }}>
            Movie Info.
          </button>
        </div>
        <div className="banner_description">{truncateString(movie?.overview, 150)}</div>
      </div>
      <div className="banner_fadebottom" />
    </header>
  );
}

export default Banner;
