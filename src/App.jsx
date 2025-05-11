import React from 'react';
import Login from './Login';  // Import the Login component
import RegisterPage from './RegisterPage';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import VehicleManagement from './Components/VehicleManagement';
import ViewUpdate from './Components/ViewUpdate';
import VehicleList from './Components/VehicleList';
import RegisterOtp from './Components/RegisterOtp';
import ForgotPasswordPage from './Components/ForgotPassword/ForgotPasswordFlow';


function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Login />  }  />
      <Route path='/register' element={<RegisterPage/>  }  />
    
      <Route path='/Sidebar' element={<Sidebar/>  }  />
      <Route path='/vehicle-manag' element={<VehicleManagement/>  }  />
      <Route path='/view/:id' element={<ViewUpdate/>  }  />
      <Route path='/vehicle' element={<VehicleList/>  }  />
      <Route path='/register-otp' element={<RegisterOtp/>  }  />
      <Route path='/forgotp' element={<ForgotPasswordPage/>  }  />

      {/* <Route path="/vehicle-manag/:id" element={<VehicleForm />} /> */}

      
    </Routes>
      


    </div>
  );
}

export default App;