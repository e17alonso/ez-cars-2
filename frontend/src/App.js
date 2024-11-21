// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import Faucet from './Faucet';
import SellCar from './SellCar';
import CarList from './CarList';
import PurchaseHistory from './PurchaseHistory';

function App() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch(newValue){
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/sell-car');
        break;
      case 2:
        navigate('/car-list');
        break;
      case 3:
        navigate('/purchase-history');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ez-Cars 2</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Faucet" />
          <Tab label="Enlistar Auto" />
          <Tab label="Autos Disponibles" />
          <Tab label="Historial de Compras" />
        </Tabs>
        <Box sx={{ marginTop: 4 }}>
          <Routes>
            <Route path="/" element={<Faucet />} />
            <Route path="/sell-car" element={<SellCar />} />
            <Route path="/car-list" element={<CarList />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
          </Routes>
        </Box>
      </Container>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
