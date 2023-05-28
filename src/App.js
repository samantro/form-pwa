import './App.css';
import Form from './form/form';
import Users from "./form/user";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Users />
        <Form />
      </header>
    </div>
  );
}

export default App;
