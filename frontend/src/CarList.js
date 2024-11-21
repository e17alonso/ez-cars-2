// frontend/src/CarList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  CircularProgress, 
  Backdrop,
  Alert 
} from '@mui/material';
import { Web3Context } from './Web3Context';
import { ethers } from 'ethers';
import tokenABI from './tokenABI.json';

function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga para obtener autos
  const [error, setError] = useState(null); // Estado de error para obtener autos
  const [purchaseLoading, setPurchaseLoading] = useState(false); // Estado de carga para compra
  const { currentAccount } = useContext(Web3Context);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x219c60fA57AfFA6BD19D0bdCf1a6e149850d252f';

  useEffect(() => {
    const getCars = async () => {
      try {
        const response = await axios.get('https://ez-cars-2-39214c762f0e.herokuapp.com/api/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error al obtener los autos:', error);
        setError('No se pudieron obtener los autos disponibles.');
      } finally {
        setLoading(false);
      }
    };
    getCars();
  }, []);

  const buyCar = async (car) => {
    try {
      setPurchaseLoading(true); // Iniciar el loader

      // Inicializar ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, tokenABI, signer);

      // Obtener el balance de PD del usuario
      const balance = await contract.balanceOf(currentAccount);
      const priceInWei = ethers.utils.parseEther(car.price);

      if (balance.lt(priceInWei)) {
        alert('Balance insuficiente de PD');
        setPurchaseLoading(false); // Detener el loader
        return;
      }

      // Transferir PD al vendedor
      const tx = await contract.transfer(car.sellerAddress, priceInWei);
      await tx.wait();

      // Marcar el auto como vendido en el backend
      await axios.put(`https://ez-cars-2-39214c762f0e.herokuapp.com/api/cars/${car._id}`);

      // Registrar la compra en el backend
      await axios.post('https://ez-cars-2-39214c762f0e.herokuapp.com/api/purchases', {
        carId: car._id,
        buyerAddress: currentAccount,
      });

      alert('Compra exitosa');
      // Actualizar la lista de autos
      setCars(cars.filter((item) => item._id !== car._id));
    } catch (error) {
      console.error('Error al comprar el auto:', error);
      alert('Error al realizar la compra');
    } finally {
      setPurchaseLoading(false); // Detener el loader en cualquier caso
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Autos Disponibles
      </Typography>
      {cars.length === 0 ? (
        <Typography variant="body1">No hay autos disponibles en este momento.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2">Año: {car.year}</Typography>
                  <Typography variant="body2">Kilometraje: {car.mileage} km</Typography>
                  <Typography variant="body2">Precio: {car.price} PD</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => buyCar(car)}
                    disabled={purchaseLoading} // Deshabilitar el botón mientras se realiza la compra
                  >
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Loader Overlay para la Compra */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={purchaseLoading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Compra en proceso...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

export default CarList;
