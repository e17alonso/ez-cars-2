// frontend/src/CarList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Web3Context } from './Web3Context';
import { ethers } from 'ethers';
import tokenABI from './tokenABI.json';

function CarList() {
  const [cars, setCars] = useState([]);
  const { currentAccount } = useContext(Web3Context);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x219c60fA57AfFA6BD19D0bdCf1a6e149850d252f';

  useEffect(() => {
    const getCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error al obtener los autos:', error);
      }
    };
    getCars();
  }, []);

  const buyCar = async (car) => {
    try {
      // Inicializar ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, tokenABI, signer);

      // Obtener el balance de PD del usuario
      const balance = await contract.balanceOf(currentAccount);
      const priceInWei = ethers.utils.parseEther(car.price);

      if (balance.lt(priceInWei)) {
        alert('Balance insuficiente de PD');
        return;
      }

      // Solicitar aprobación para transferir PD si es necesario
      // (Asumimos que el contrato permite transferencias directas)

      // Transferir PD al vendedor
      const tx = await contract.transfer(car.sellerAddress, priceInWei);
      await tx.wait();

      // Marcar el auto como vendido en el backend
      await axios.put(`http://localhost:5000/api/cars/${car._id}`);

      // Registrar la compra en el backend
      await axios.post('http://localhost:5000/api/purchases', {
        carId: car._id,
        buyerAddress: currentAccount,
      });

      alert('Compra exitosa');
      // Actualizar la lista de autos
      setCars(cars.filter((item) => item._id !== car._id));
    } catch (error) {
      console.error('Error al comprar el auto:', error);
      alert('Error al realizar la compra');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Autos Disponibles
      </Typography>
      <Grid container spacing={2}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2">Año: {car.year}</Typography>
                <Typography variant="body2">Kilometraje: {car.mileage}</Typography>
                <Typography variant="body2">Precio: {car.price} PD</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" onClick={() => buyCar(car)}>
                  Comprar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CarList;
