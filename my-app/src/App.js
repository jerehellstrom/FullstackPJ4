import React, { useState } from 'react';
import './index.css'
export default function App(){

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

   //Get Data for all movies -> function for button 2
   const GetMovieData = () => {
    fetch("http://localhost:8081/api/getall/")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log(data);
        const items = data;

        setResults(items)
      });
  };

  // Event Handler for button 1
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Tapahtuman aiheutti: ", event.target);
    console.log("Hakusana: ", query);

    GetOneMovie();
  };

  // Event handler for button 2
  const handleClick = (event) => {
    event.preventDefault();
    console.log("Tapahtuman aiheutti: ", event.target);

    GetMovieData();
  };


 

  // Find one movie - function of button 1
  const GetOneMovie = () => {
    fetch("http://localhost:8081/api/" + query)
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log("Haun tulokset", data);
        const items = data;
        console.log("One movie: ", data);
  
        setResults(items)
      });
  };

 // Displaying the information of the movies in an array
const MovieArray = (props) => {
  const { data } = props;
  // Poster image
  let posterImg;

  // Function for checking images
  const CheckPoster = (props) => {
    let poster = props.src;
    // If there is no defined image, then it will be replaced with placeholder
    if (poster === "" || poster === null) {
      posterImg = "https://via.placeholder.com/150";
    } else {
      posterImg = poster;
    }
    // Return image tag, onError in case of error
    return (
      <img
        src={posterImg}
        alt="Poster"
        className="img-thumbnail"
        onError={addDefaultSrc}
        width="50%"
      />
    );
  };

  //Try to place an empty icon in place of error or at least remove image tag
  const addDefaultSrc = (ev) => {
    console.log(ev.target);
    ev.target.src = "https://via.placeholder.com/150";
    ev.onError = null;
  };

  return (
    <div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr key={props.id}>
            <th scope="col">Title</th>
            <th scope="col">Year</th>
            <th scope="col">Directors</th>
            <th scope="col">Rating</th>
            <th scope="col">Poster</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr>
              <td key={i}> {item.title}</td>
              <td> {item.year} </td>
              <td> {item.directors} </td>
              <td> {item.imdb.rating}</td>
              {/*  Creating an image tag within the component */}
              <td id="pic">
                <CheckPoster src={item.poster} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
return (
  <div>
    <h1>Hakusivu</h1>
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label></label>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-control"
            placeholder="Syötä hakutermi"
            name="query"
          />
        </div>
        
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit
            </button>

          <button
            type="button"
            className="btn"
            onClick={handleClick}
          >
            Hae kaikki
            </button>
        </div>
      </form>
    </div>
      <MovieArray data={results} />
  </div>
);
};

