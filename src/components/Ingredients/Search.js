import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const [inputFilter, setInputFilter] = useState("");
  const {filteredIngredients} = props;
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(inputFilter === inputRef.current.value) {
        const queryParams = inputFilter.length === 0 
          ? "" 
          : `?orderBy="title"&equalTo="${inputFilter}"`;

        fetch("https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json" + queryParams)
        .then(response => response.json())
        .then(responseData => {
          const fetchedFilteredIngs = [];
          for(let key in responseData)
            fetchedFilteredIngs.push({
                title: responseData[key].title,
                amount: responseData[key].amount,
                id: key
            });
          filteredIngredients(fetchedFilteredIngs);
        });
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, [inputFilter, filteredIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
              ref      = {inputRef}
              type     = "text" 
              value    = {inputFilter}
              onChange = {event => setInputFilter(event.target.value)}
            />
        </div>
      </Card>
    </section>
  );
});

export default Search;
