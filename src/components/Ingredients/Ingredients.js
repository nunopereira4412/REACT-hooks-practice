import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientsList from './IngredientList';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS");
  }, [ingredients]);

  const addIngredientHandler = ing => {
    fetch("https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ing),
      headers: {"Content-type": "application/json"}
    })
      .then(response => response.json())
        .then(responseData => setIngredients(prevIngredients => [
            ...prevIngredients, 
            {
              ...ing, 
              id: responseData.name
            }
          ])
        );
  };

  const removeItemHandler = (id) => {
    setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
  };

  const filteredIngredientsHandler = useCallback(ings => setIngredients(ings), []);

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredientHandler}/>
      <section>
        <Search filteredIngredients={filteredIngredientsHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
