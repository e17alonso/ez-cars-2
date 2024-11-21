// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
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

const drawerWidth = 240;

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mapeo de rutas a índices
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = indexToTabName[currentPath];
    if (currentIndex !== undefined) {
      setSelectedIndex(currentIndex);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { label: 'Faucet', icon: <LocalOfferIcon />, path: '/' },
    { label: 'Enlistar Auto', icon: <AddCircleOutlineIcon />, path: '/sell-car' },
    { label: 'Autos Disponibles', icon: <DirectionsCarIcon />, path: '/car-list' },
    { label: 'Historial de Compras', icon: <HistoryIcon />, path: '/purchase-history' },
  ];

  const drawerList = () => (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      {/* Indicador de Saldo de Tokens en la Parte Superior del Sidebar */}
      <Box sx={{ padding: theme.spacing(2), display: 'flex', alignItems: 'center' }}>
        <TokenBalanceWeb3 />
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem 
            button 
            key={item.label} 
            selected={selectedIndex === index} 
            onClick={() => {
              navigate(item.path);
              setSelectedIndex(index);
            }}
          >
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Navbar Superior */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Botón de Hamburguesa Siempre Visible */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              position: 'absolute', 
              left: theme.spacing(2),
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la Aplicación Centrado */}
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontFamily: 'Roboto Slab, serif',
              fontWeight: 'bold',
            }}
          >
            Ez-Cars 2
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en dispositivos móviles
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerList()}
      </Drawer>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          padding: theme.spacing(3),
          marginTop: theme.spacing(8), // Espacio para el AppBar
        }}
      >
        <Routes>
          <Route path="/" element={<Faucet />} />
          <Route path="/sell-car" element={<SellCar />} />
          <Route path="/car-list" element={<CarList />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function WrappedApp() {
  return (
    <Web3Provider>
      <Router>
        <AppContent />
      </Router>
    </Web3Provider>
  );
}
