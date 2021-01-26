import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {

  const [inputFilter, setInputFilter] = useState("");
  const {filteredIngredients} = props;
  const inputRef = useRef();

  const {
    loading, 
    error, 
    responseData,  
    sendRequest, 
    clear
  } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(inputFilter === inputRef.current.value) {
        const queryParams = inputFilter.length === 0 
          ? "" 
          : `?orderBy="title"&equalTo="${inputFilter}"`;

        sendRequest(
          "https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json" + queryParams,
          "GET"
        ); 
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, [inputFilter, inputRef, sendRequest]);

  useEffect(() => {
    if(!loading && !error && responseData) {
      const fetchedFilteredIngs = [];
        for(let key in responseData)
          fetchedFilteredIngs.push({
              title: responseData[key].title,
              amount: responseData[key].amount,
              id: key
          });
      filteredIngredients(fetchedFilteredIngs); 
    }
  }, [filteredIngredients, loading, error, responseData]);

  return (
    <section className="search">
      {error && 
        <ErrorModal onClose={clear}>
          {error}
        </ErrorModal>
      }
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading &&  <span>...loading</span>} 
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
