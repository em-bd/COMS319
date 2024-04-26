import logo from './logo.svg';
import './App.css';

function App() {
 


  return (
    <div>
      {(viewer === 0) && <Create />}
      {(viewer === 1) && <Remove />}
      {(viewer === 2) && <Update />}
      {(viewer === 3) && <Delete />}
    </div>
  );
}

export default App;
