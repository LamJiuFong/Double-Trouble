import { useState } from "react";
import DATABASE from "../../../utils/database";
import "./AddStockInput.css";

export default function AddStockInput({setStocks, setAddStocksVisibility}) {
    const defaultInputValue = {
        ticker: "",
        position: "BUY",
        quantity: 10,
        price: 50,
    };

    const [inputValues, setInputValues] = useState(defaultInputValue);

    //handle change of inputs
    const handleChange = (event) => {
        setInputValues((inputValues) => ({
            ...inputValues,
            [event.target.name]: event.target.value,
        }));
    };

    //handle cancel
    const handleCancel = (event) => {
        setInputValues(defaultInputValue);
        setAddStocksVisibility(false);
    };

    //handle new stock additions
    const handleSubmit = async (event) => {
        //prevents default behavior of refreshing the page
        event.preventDefault(); 

        try {
            //validation of a correct input
            if (inputValues.ticker && inputValues.price > 0 && inputValues.quantity > 0) {
                const newStock = {
                    ticker: inputValues.ticker,
                    position: inputValues.position,
                    quantity: inputValues.quantity,
                    price: inputValues.price,
                };

                const response = await fetch(`https://${DATABASE}.json`, {
                    method: "POST",
                    "Content-Type": "application/json",
                    body: JSON.stringify(newStock),
                });

                const data = await response.json();

                if (data.name) {
                    setStocks((stocks) => [
                        ...stocks,
                        { id: data.name, ...newStock},
                    ]);
                    setInputValues(defaultInputValue);
                    setAddStocksVisibility(false);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
       <form className="AddStockForm">
            <div className="new-stock">
                <input
                    type="text"
                    name="ticker"
                    value={inputValues.ticker}
                    onChange={handleChange}
                    className="new-stock-input"/>
            </div>

            <div className="new-stock">
                <select
                    name="position"
                    onChange={handleChange}
                    value={inputValues.position}
                    className="new-stock-input"
                >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                </select>
            </div>

            <div className="new-stock">
                <input
                    type="number"
                    min="0"
                    name="quantity"
                    onChange={handleChange}
                    value={inputValues.quantity}
                    className="new-stock-input"
                />
            </div>

            <div className="new-stock">
                <input
                    type="number"
                    min="0"
                    name="price"
                    onChange={handleChange}
                    value={inputValues.price}
                    className="new-stock-input"
                />
            </div>
            
            
            <button className="button-add" onClick={handleSubmit}>
                <span>+</span>
            </button>

            <button className="button-cancel" onClick={handleCancel}>
                <span>Cancel</span>
            </button>
       </form> 
    );
}