// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HistoryIcon from '@mui/icons-material/History';
import Faucet from './Faucet';
import SellCar from './SellCar';
import CarList from './CarList';
import PurchaseHistory from './PurchaseHistory';
import TokenBalanceWeb3 from './TokenBalanceWeb3';
import { Web3Provider } from './Web3Context';

function App() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Mapear rutas a índices de pestañas
  const tabNameToIndex = {
    0: '/',
    1: '/sell-car',
    2: '/car-list',
    3: '/purchase-history',
  };

  const indexToTabName = {
    '/': 0,
    '/sell-car': 1,
    '/car-list': 2,
    '/purchase-history': 3,
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = indexToTabName[currentPath];
    if (currentIndex !== undefined) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(tabNameToIndex[newValue]);
  };

  return (
    <div>
      {/* Navbar Mejorada */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Título de la Aplicación */}
          <Typography variant="h6" component="div">
            Ez-Cars 2
          </Typography>

          {/* Pestañas de Navegación */}
          <Tabs 
            value={value} 
            onChange={handleChange} 
            textColor="inherit" 
            indicatorColor="secondary"
            sx={{ marginLeft: 'auto' }} // Empuja las pestañas a la derecha
          >
            <Tab 
              icon={<LocalOfferIcon />} 
              label="Faucet" 
              sx={{ 
                '&.Mui-selected': { 
                  color: 'secondary.main', 
                  fontWeight: 'bold' 
                },
                '&:hover': {
                  color: 'secondary.light',
                }
              }} 
            />
            <Tab 
              icon={<AddCircleOutlineIcon />} 
              label="Enlistar Auto" 
              sx={{ 
                '&.Mui-selected': { 
                  color: 'secondary.main', 
                  fontWeight: 'bold' 
                },
                '&:hover': {
                  color: 'secondary.light',
                }
              }} 
            />
            <Tab 
              icon={<DirectionsCarIcon />} 
              label="Autos Disponibles" 
              sx={{ 
                '&.Mui-selected': { 
                  color: 'secondary.main', 
                  fontWeight: 'bold' 
                },
                '&:hover': {
                  color: 'secondary.light',
                }
              }} 
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="Historial de Compras" 
              sx={{ 
                '&.Mui-selected': { 
                  color: 'secondary.main', 
                  fontWeight: 'bold' 
                },
                '&:hover': {
                  color: 'secondary.light',
                }
              }} 
            />
          </Tabs>

          {/* Indicador de Saldo de Tokens */}
          <Box sx={{ marginLeft: 2 }}>
            <TokenBalanceWeb3 />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido Principal */}
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Faucet />} />
          <Route path="/sell-car" element={<SellCar />} />
          <Route path="/car-list" element={<CarList />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
        </Routes>
      </Container>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Web3Provider>
      <Router>
        <App />
      </Router>
    </Web3Provider>
  );
}
