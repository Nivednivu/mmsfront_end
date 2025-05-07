import React from 'react';
import Login from './Login';  // Import the Login component
import RegisterPage from './RegisterPage';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import DispatchList from './Components/DispatchList';
import VehicleManagement from './Components/VehicleManagement';


function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Login />  }  />
      <Route path='/register' element={<RegisterPage/>  }  />
    
      <Route path='/Sidebar' element={<Sidebar/>  }  />
      <Route path='/dispatch' element={<DispatchList/> }  />

      <Route path='/vehicle-manag' element={<VehicleManagement/>  }  />
      
    </Routes>
      


    </div>
  );
}

export default App;