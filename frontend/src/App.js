// frontend/src/App.js
import React from 'react';
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
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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

  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = indexToTabName[currentPath];
    if (currentIndex !== undefined) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(tabNameToIndex[newValue]);
    if (isMobile) {
      setDrawerOpen(false); // Cerrar el drawer en dispositivos móviles al seleccionar una pestaña
    }
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
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Indicador de Saldo de Tokens en la Parte Superior del Sidebar */}
      <Box sx={{ padding: theme.spacing(2), display: 'flex', alignItems: 'center' }}>
        <TokenBalanceWeb3 />
      </Box>
      <List>
        {menuItems.map((item) => (
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Navbar Superior */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Botón de Hamburguesa para abrir el Sidebar */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ position: 'absolute', left: theme.spacing(2), display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la Aplicación Centrado */}
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontFamily: 'Roboto Slab, serif',
              fontWeight: 'bold'
            }}
          >
            Ez-Cars 2
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en dispositivos móviles
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { xs: 'block', sm: 'block' },
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
