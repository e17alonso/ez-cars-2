// frontend/src/SellCar.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Web3Context } from './Web3Context';
import axios from 'axios';

function SellCar() {
  const { currentAccount } = useContext(Web3Context);
  const [carDetails, setCarDetails] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    sellerAddress: currentAccount,
  });

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const submitCar = async () => {
    // Validaciones básicas
    const { brand, model, year, mileage, price } = carDetails;
    if (!brand || !model || !year || !mileage || !price) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cars', carDetails);
      alert('Auto enlistado exitosamente');
      // Resetear formulario
      setCarDetails({
        brand: '',
        model: '',
        year: '',
        mileage: '',
        price: '',
        sellerAddress: currentAccount,
      });
    } catch (error) {
      console.error('Error al enlistar el auto:', error);
      alert('Error al enlistar el auto');
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enlistar Nuevo Auto
      </Typography>
      <TextField
        label="Marca"
        name="brand"
        value={carDetails.brand}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Modelo"
        name="model"
        value={carDetails.model}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Año"
        name="year"
        value={carDetails.year}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Kilometraje"
        name="mileage"
        value={carDetails.mileage}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Precio en PD"
        name="price"
        value={carDetails.price}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="Dirección del Vendedor"
        name="sellerAddress"
        value={carDetails.sellerAddress}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled // La dirección se obtiene de MetaMask y no debe ser editable
      />
      <Button variant="contained" color="primary" onClick={submitCar}>
        Enlistar Auto
      </Button>
    </Box>
  );
}

export default SellCar;
