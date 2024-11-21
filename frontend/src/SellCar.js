// frontend/src/SellCar.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, Typography, TextField, Box, CircularProgress } from '@mui/material';
import { Web3Context } from './Web3Context';
import { useNavigate } from 'react-router-dom';

function SellCar() {
  const { currentAccount } = useContext(Web3Context);
  const [sellerAddress, setSellerAddress] = useState(currentAccount);
  const [carDetails, setCarDetails] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCarDetails({
      ...carDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSellerAddressChange = (e) => {
    setSellerAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !sellerAddress ||
      !carDetails.brand ||
      !carDetails.model ||
      !carDetails.year ||
      !carDetails.mileage ||
      !carDetails.price
    ) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    // Validar números
    if (isNaN(carDetails.year) || isNaN(carDetails.mileage) || isNaN(carDetails.price)) {
      setMessage('Asegúrate de que Año, Kilometraje y Precio sean números válidos.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cars`, {
        sellerAddress,
        brand: carDetails.brand,
        model: carDetails.model,
        year: Number(carDetails.year),
        mileage: Number(carDetails.mileage),
        price: Number(carDetails.price),
      });

      setMessage('Auto enlistado exitosamente.');

      // Redirigir a la página de Autos Disponibles después de 2 segundos
      setTimeout(() => {
        navigate('/car-list');
      }, 2000);
    } catch (error) {
      console.error('Error al enlistar el auto:', error);
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data}`);
      } else {
        setMessage('Error al enlistar el auto. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Enlistar Auto
      </Typography>
      
      <TextField
        label="Dirección del Vendedor"
        value={sellerAddress}
        onChange={handleSellerAddressChange}
        fullWidth
        margin="normal"
        type="text"
        required
        disabled={loading} // Deshabilitar campo durante la carga
      />

      <TextField
        label="Marca"
        name="brand"
        value={carDetails.brand}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="text"
        required
        disabled={loading}
      />

      <TextField
        label="Modelo"
        name="model"
        value={carDetails.model}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="text"
        required
        disabled={loading}
      />

      <TextField
        label="Año"
        name="year"
        value={carDetails.year}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
        disabled={loading}
      />

      <TextField
        label="Kilometraje"
        name="mileage"
        value={carDetails.mileage}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
        disabled={loading}
      />

      <TextField
        label="Precio (en PD)"
        name="price"
        value={carDetails.price}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        required
        disabled={loading}
      />

      <Box sx={{ position: 'relative', display: 'inline-flex', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Enlistar Auto
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>

      {message && (
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default SellCar;
