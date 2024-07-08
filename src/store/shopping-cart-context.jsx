import { createContext, useReducer } from 'react'
import { DUMMY_PRODUCTS } from '../dummy-products.js'
export const CartContext = createContext({
  items: [],
  addItem: () => {},
  updatedItem: () => {},
})
// reducer function

function shoppingCartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const updatedItems = [...state.items]

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload,
      )
      const existingCartItem = updatedItems[existingCartItemIndex]

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        }
        updatedItems[existingCartItemIndex] = updatedItem
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload,
        )
        updatedItems.push({
          id: action.payload.id,
          name: product.title,
          price: product.price,
          quantity: 1,
        })
      }

      return {
        items: updatedItems,
      }
    }
    case 'UPDATE_ITEM': {
      const updatedItems = [...state.items]
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId,
      )

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      }

      updatedItem.quantity += action.payload.amount

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1)
      } else {
        updatedItems[updatedItemIndex] = updatedItem
      }

      return {
        items: updatedItems,
      }
    }
    default:
      return state
  }
}
export default function CartContextProvider({ children }) {
  const initialState = {
    items: [],
  }

  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    initialState,
  )

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: id,
    })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_ITEM',
      payload: { productId, amount },
    })
  }
  const CtxValue = {
    items: shoppingCartState.items,
    addItem: handleAddItemToCart,
    updatedItem: handleUpdateCartItemQuantity,
  }

  return (
    <CartContext.Provider value={CtxValue}>{children}</CartContext.Provider>
  )
}
