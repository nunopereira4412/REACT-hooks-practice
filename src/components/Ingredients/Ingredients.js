import React, 
       {
        useEffect, 
        useCallback, 
        useReducer,
        useMemo  
      }                from 'react';

import IngredientForm  from './IngredientForm';
import Search          from './Search';
import IngredientsList from './IngredientList';
import ErrorModal      from '../UI/ErrorModal';
import useHttp         from '../../hooks/http';

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


const Ingredients = () => {
  
  const [ingredients, dispatchIngs] = useReducer(ingredientsReducer, []);
  
  const {loading, error, responseData, sendRequest, extraReq, reqIdentifier} = useHttp();
   
  useEffect(() => {
    console.log("RENDERING INGREDIENTS");
    if(!loading && !error && reqIdentifier === "DELETE_ING") 
      dispatchIngs({type: "DELETE", id: extraReq});
    else if(!loading && !error && reqIdentifier === "ADD_ING")
      dispatchIngs({type: "ADD", ingredient: {...extraReq, id: responseData.name}});
  }, [responseData, extraReq, reqIdentifier, loading, error]);

  const addIngredientHandler = useCallback(ing => {
    sendRequest(
      "https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json",
      "POST",
      JSON.stringify(ing),
      ing,
      "ADD_ING"
    );
  }, [sendRequest]);

  const removeItemHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      "DELETE",
      null,
      id,
      "DELETE_ING"
    ); 
  }, [sendRequest] );

  const filteredIngredientsHandler = useCallback(filteredIngs => 
    dispatchIngs({
        type: "SET", 
        ingredients: filteredIngs}
    ), []);

  const closeModalHandler = useCallback(() => {}, []);

  const ingredientsList = useMemo(() => (
    <IngredientsList 
        ingredients={ingredients}
        onRemoveItem={removeItemHandler}
      />
  ), [ingredients, removeItemHandler]);

  return (
    <div className="App">
      {error && 
        <ErrorModal onClose={closeModalHandler}>
          {error}
        </ErrorModal>
      }
      <IngredientForm addIngredient={addIngredientHandler} loading={loading}/>
      <section>
        <Search filteredIngredients={filteredIngredientsHandler}/>
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
