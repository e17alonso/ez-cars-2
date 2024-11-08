// frontend/src/App.js
import React from 'react';
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import Faucet from './Faucet';
import SellCar from './SellCar';
import CarList from './CarList';
import PurchaseHistory from './PurchaseHistory';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          {value === 0 && <Faucet />}
          {value === 1 && <SellCar />}
          {value === 2 && <CarList />}
          {value === 3 && <PurchaseHistory />}
        </Box>
      </Container>
    </div>
  );
}

export default App;
