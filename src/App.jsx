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
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashbord';
import Query from './Components/Query';
import QueryList from './Components/QueryList';
import QueryEdit from './Components/QueryEdit';
import QueryView from './Components/QueryView';
import UserDashboard from './Components/User/UserDashboard';
import UserDispatch from './Components/User/UserDispatch';
import UserList from './Components/User/UserList';
import QueryEntry from './Components/Query/QueryEntry';
import QueryAdminView from './Components/Query/QueryAdminView';
import QueryAdminList from './Components/Query/QueryAdminList';
import UserView from './Components/User/UserView';
import QueryadminLast from './Components/Query/QueryadminLast';
import QRCodeGenerator from './Components/QrCode/QRCodeGenerator';
import UserLast from './Components/User/UserLast';
import Quaryyy from './Components/Quaryyy';
import QueryLastData from './Components/QrCode/QueryLastData';
import AllUsersData from './Components/User/AllUsersData';


function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Login />  }  />
      <Route path='/register' element={<RegisterPage/>  }  />
    
      <Route path='/side' element={<Sidebar/>  }  />
      <Route path='/admin' element={<AdminLogin/>  }  />
      <Route path='/query' element={<Query/>  }  />
      <Route path='/querylist' element={<QueryList/>  }  />
      <Route path='/queryview/:id' element={<QueryView/>  }  />
      <Route path='/queryedit/:id' element={<QueryEdit/>  }  />
      <Route path='/admindashbord' element={<AdminDashboard/>  }  />
      <Route path='/vehicle-manag' element={<VehicleManagement/>  }  />
      <Route path='/view/:id' element={<ViewUpdate/>  }  />
      <Route path='/vehicle' element={<VehicleList/>  }  />
      <Route path='/register-otp' element={<RegisterOtp/>  }  />
      <Route path='/forgotp' element={<ForgotPasswordPage/>  }  />
      <Route path='/userdasboard' element={<UserDashboard/>  }  />
      <Route path='/userdispatch' element={<UserDispatch/>  }  />
      <Route path='/userlist' element={<UserList/>  }  />
      <Route path='/queryentry' element={<QueryEntry/>  }  />
      <Route path='/adminlist' element={<QueryAdminList/>  }  />
      <Route path='/adminlast' element={<QueryadminLast/>  }  />
      <Route path='/adminqview/:id' element={<QueryAdminView/>  }  />
      <Route path='/userview' element={<UserView/>  }  />
      <Route path='/qr' element={<QRCodeGenerator/>  }  />
      <Route path='/lastuser/:id' element={<UserLast/>  }  />
      <Route path='/qu' element={<Quaryyy/>  }  />
      <Route path='/q' element={<QueryLastData/>  }  />
      <Route path='/alluser' element={<AllUsersData/>  }  />

      {/* <Route path="/vehicle-manag/:id" element={<VehicleForm />} /> */}

      
    </Routes>
      


    </div>
  );
}

export default App;