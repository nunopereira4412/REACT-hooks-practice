import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientsList from './IngredientList';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = (ing) => {
    setIngredients(prevIngredients => [
      ...prevIngredients, 
      {
        ...ing, 
        id: Math.random().toString()
      }
    ])
  };

  const removeItemHandler = (id) => {
    setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientsList ingredients={ingredients} onRemoveItem={removeItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
