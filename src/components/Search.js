import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
  const [term, setTerm] = useState("programming");
  const [result, setResult] = useState([]);

  useEffect(() => {
    const search = async () => {
      // as useeffect cannot be an async giving this one as async intead of then, catch we can use this way
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          // for url query param this notation
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: term, // term we type
        },
      });
      setResult(data.query.search);
    };

    if (term && !result.length) {
      // calling cleanup after initial render as answer omes late
      search();
    } else {
      const timeoutId = setTimeout(() => {
        // timer function
        if (term) {
          search();
        }
      }, 1000); // after this time api reuqest happens

      return () => {
        clearTimeout(timeoutId); // clean up function
      };
    }
  }, [term]);

  const renderedResults = result.map((result) => {
    // mapping through results, span used if not results will have html content for xss attck beacuse the url can be a corrupted url
    return (
      <div key={result.pageid} className="item">
        <div className="content">
          <div className="header">{result.title}</div>

          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="ui celled list">{renderedResults}</div>
    </div>
  );
};

export default Search;
