import React, { useEffect, useState } from "react";
import axios from "./Axios";
import "./Row.css"; // Import CSS file for component styling
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row({ title, fetchUrl, isLargeRow }) {
  const path = "https://image.tmdb.org/t/p/original";
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        // console.log(request.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  // console.log(trailerUrl);
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl(null);
      console.log(movie?.media_type);
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get("v");
            if (videoId) {
              setTrailerUrl(videoId);
            } else {
              console.log("No video ID found in the trailer URL");
            }
          } else {
            // console.log("No trailer found for this movie.");
            // const message = ` Movie Name: ${movie.title || movie.name} Description: ${movie.overview || "No description available"}`;
            //  alert(message);
            const modal = document.createElement("div");
            modal.classList.add("modal");
            modal.innerHTML = `
              <div class="modal-content">
              <button class="close">&times;</button>
              <img src="${path}/${movie.poster_path}" alt="${movie.title}" />
              <h2>${movie.title || movie.name}</h2>  
              <p>Rating: ${movie.vote_average || "No description available"}</p>
              <p>Release Date: ${movie?.first_air_date || movie?.release_date}</p>
              <p>Overview: ${movie.overview}</p>
              </div>`;
            document.body.appendChild(modal);
            const closeButton = modal.querySelector(".close");
            closeButton.addEventListener("click", () => {
              modal.remove();
            });
          }
        })
        .catch((error) => {
          console.log("Error fetching trailer:", error);
        });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {/* backdrop_path */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => {
              handleClick(movie);
            }}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${path}/${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.title}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
