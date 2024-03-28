import './App.css';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
import Fib from './pages/Fib';
import OtherPage from './pages/OtherPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Link to="/">Go to homepage</Link>
      <Link to="/other">Other Page</Link>

      <Routes>
        <Route path='/' element={<Fib/>}/>
        <Route path='/other' element={<OtherPage />}/>
      </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
