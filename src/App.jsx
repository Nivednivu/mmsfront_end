import React from 'react';
import Login from './Login';  // Import the Login component
import RegisterPage from './RegisterPage';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
// import VehicleManagement from './Components/VehicleManagement';


function App() {
  return (
    <div>
    <Routes>
      <Route path='/Login' element={<Login />  }  />
      <Route path='/Register' element={<RegisterPage/>  }  />
    
      <Route path='/Sidebar' element={<Sidebar/>  }  />
      {/* <Route path='/Sidebar' element={<VehicleManagement/>  }  /> */}
      
    </Routes>
      
    
      
    </div>
  );
}

export default App;