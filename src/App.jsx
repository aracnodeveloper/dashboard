


import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/home/home'

//const Home = lazy(() => import('./pages/home/home'));


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        {//<Route path="/nosotros/:seccion?" element={<Suspense><About /></Suspense>} />
        }
      </Routes>
    </Router>
        </>
    
  );
}

export default App
