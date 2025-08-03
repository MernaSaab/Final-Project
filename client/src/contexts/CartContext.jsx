import { createContext, useReducer, useContext, useEffect } from "react";

// --------- trạng thái ראשוני -----------
const initialState = JSON.parse(localStorage.getItem("cart")) ?? [];

/* cart item = { id, name, price, imgUrl, qty } */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === existing.id ? { ...i, qty: i.qty + action.item.qty } : i
        );
      }
      return [...state, action.item];

    case "UPDATE_QTY":
      return state.map(i =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );

    case "REMOVE":
      return state.filter(i => i.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // שכיבה / התעוררות מה-localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // פעולות נוחות
  const addItem = (item, qty = 1) =>
    dispatch({ type: "ADD", item: { ...item, qty } });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const removeItem = id => dispatch({ type: "REMOVE", id });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQty, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}