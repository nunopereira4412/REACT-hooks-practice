import React, {useEffect, useCallback, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientsList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch(action.type) {
    case("SET"):
      return action.ingredients;
    case("ADD"): 
      return [...currentIngredients, action.ingredient];
    case("DELETE"):
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Should not reach here");
  }
}

const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case("SEND"):
      return {loading: true, error: null};
    case("RESPONSE"):
      return {...curHttpState, loading: false};
    case("ERROR"):
      return {loading: false, error: action.error.message};
    case("CLEAR"):
      return {...curHttpState, error: null};
    default:
      throw new Error("Should not reach here");
  }
}

const Ingredients = () => {

  const [ingredients, dispatchIngs] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  useEffect(() => {
    console.log("RENDERING INGREDIENTS");
  }, [ingredients]);

  const addIngredientHandler = ing => {
    dispatchHttp({type: "SEND"});
    fetch("https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ing),
      headers: {"Content-type": "application/json"}
    })
      .then(response => {
        dispatchHttp({type: "RESPONSE"});
        return response.json();
      })
        .then(responseData => 
          dispatchIngs({
              type: "ADD", 
              ingredient: {
                  ...ing, 
                  id: responseData.name
              }
          })
         )
        .catch(error => {
          dispatchHttp({type: "ERROR", error: error});
        });
  };

  const removeItemHandler = (id) => {
    dispatchHttp({type: "SEND"});
    fetch(`https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients/${id}.json`, 
    {
      method: "DELETE",
    })
      .then(resp => {
        dispatchHttp({type: "RESPONSE"});
        dispatchIngs({type: "DELETE", id: id});
      })
      .catch(error => {
        dispatchHttp({type: "ERROR", error: error});
      });
  };

  const filteredIngredientsHandler = useCallback(filteredIngs => 
    dispatchIngs({
        type: "SET", 
        ingredients: filteredIngs}
    ), []);

  const closeModalHandler = () => dispatchHttp({type: "CLEAR", error: null});

  return (
    <div className="App">
      {httpState.error && 
        <ErrorModal onClose={closeModalHandler}>
          {httpState.error}
        </ErrorModal>
      }
      <IngredientForm addIngredient={addIngredientHandler} loading={httpState.loading}/>
      <section>
        <Search filteredIngredients={filteredIngredientsHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
