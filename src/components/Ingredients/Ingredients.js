import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientsList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("RENDERING INGREDIENTS");
  }, [ingredients]);

  const addIngredientHandler = ing => {
    setIsLoading(true);
    fetch("https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ing),
      headers: {"Content-type": "application/json"}
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
        .then(responseData => setIngredients(prevIngredients => [
            ...prevIngredients, 
            {
              ...ing, 
              id: responseData.name
            }
          ])
        )
        .catch(error => {
          setIsLoading(false);
          setErrorMessage("ERROR: " + error.message);
          setShowErrorModal(true);
        });
  };

  const removeItemHandler = (id) => {
    setIsLoading(true);
    fetch(`https://react-hooks-practice-64697-default-rtdb.firebaseio.com/ingredients/${id}.json`, 
    {
      method: "DELETE",
    })
      .then(resp => {
        setIsLoading(false);
        setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id))
      })
      .catch(error => {
        setIsLoading(false);
        setErrorMessage("ERROR: " + error.message);
        setShowErrorModal(true);
      });
  };

  const filteredIngredientsHandler = useCallback(ings => setIngredients(ings), []);

  const closeModalHandler = () => setShowErrorModal(false);

  return (
    <div className="App">
      {showErrorModal && 
        <ErrorModal onClose={closeModalHandler}>
          {errorMessage}
        </ErrorModal>
      }
      <IngredientForm addIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search filteredIngredients={filteredIngredientsHandler}/>
        <IngredientsList ingredients={ingredients} onRemoveItem={removeItemHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
