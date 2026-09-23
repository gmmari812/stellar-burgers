import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { RootState, useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredientsSum = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const { id } = useParams();

  const ingredientData = ingredientsSum.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
