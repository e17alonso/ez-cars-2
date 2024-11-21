// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: 'Faucet', icon: <LocalOfferIcon />, path: '/' },
    { label: 'Enlistar Auto', icon: <AddCircleOutlineIcon />, path: '/sell-car' },
    { label: 'Autos Disponibles', icon: <DirectionsCarIcon />, path: '/car-list' },
    { label: 'Historial de Compras', icon: <HistoryIcon />, path: '/purchase-history' },
  ];

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.label} onClick={() => navigate(item.path)}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {/* Navbar Mejorada con Pestañas Centradas */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Menú de Hamburguesa (Solo en Pantallas Pequeñas) */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la Aplicación */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: { xs: 1, sm: 0 }, 
              textAlign: { xs: 'center', sm: 'left' }, 
              fontFamily: 'Roboto Slab, serif',
              fontWeight: 'bold'
            }}
          >
            Ez-Cars 2
          </Typography>

          {/* Pestañas de Navegación (Centradas en Pantallas Medianas y Grandes) */}
          <Tabs 
            value={value} 
            onChange={handleChange} 
            textColor="inherit" 
            indicatorColor="secondary"
            sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              marginLeft: 'auto',
              flexGrow: 1,
              justifyContent: 'center'
            }} 
          >
            <Tab 
              icon={<LocalOfferIcon sx={{ fontSize: 20 }} />} 
              label="Faucet" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.3s',
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
              icon={<AddCircleOutlineIcon sx={{ fontSize: 20 }} />} 
              label="Enlistar Auto" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.3s',
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
              icon={<DirectionsCarIcon sx={{ fontSize: 20 }} />} 
              label="Autos Disponibles" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.3s',
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
              icon={<HistoryIcon sx={{ fontSize: 20 }} />} 
              label="Historial de Compras" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.3s',
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
          <Box sx={{ marginLeft: { xs: 0, sm: 2 } }}>
            <TokenBalanceWeb3 />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para el Menú de Hamburguesa */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>

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
