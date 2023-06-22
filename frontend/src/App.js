import logo from "./logo.svg";
import "./App.css";
import data from "./data";

function App() {
  return (
    <div className="App">
      <h1>Featured Products</h1>
      {data.products.map((product) => (
        <div>
          <img src={product.image} alt="image" />
          <p>{product.title}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
