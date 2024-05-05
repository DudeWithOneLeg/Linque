import { useState } from "react";
import objects from "./object"
import "./index.css";

export default function ViewObjects({ post }) {
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState([]);
  // console.log(objects)
  let results;


  if (post && post.PostImage && post.PostImage.results) {

    results = JSON.parse(post.PostImage.results);
    // console.log(results);
    // console.log('hi')
  }

  return results ? (
    <div className="post-like-button">
      <div className="results">
        {
          <div className="objects-container">
            {Object.values(results).length &&
              Object.values(results).map((object) => {
                return (
                  <div
                    className="objects"
                    onClick={() => {
                      setData(object.matches);
                      setShowResults(true);
                    }}
                    key={object.image}
                  >
                    {objects[object.name] ? (
                      <img
                        src={objects[object.name]}
                        className="object-icons"
                      />
                    ) : (
                      <p>{object.name}</p>
                    )}
                    {/* <img src={object.image}/> */}
                  </div>
                );
              })}
          </div>
        }
        {showResults && (
          <div className="results-container">
            {data.map((result) => {
              return (
                <a href={result.link} target="_blank" className="result-card">
                  <img src={result.thumbnail} className="result-image" />

                  <div className="result-info">
                    <p>
                      {result.title.length > 30
                        ? result.title.split("").slice(0, 40).join("") + "..."
                        : result.title}
                    </p>
                    <p className="result-price">
                      {result.price && result.price.value}
                    </p>
                    <p className="result-source">{result.source}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
