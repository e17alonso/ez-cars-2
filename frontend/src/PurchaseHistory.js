// frontend/src/PurchaseHistory.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Web3Context } from './Web3Context';

function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const { currentAccount } = useContext(Web3Context);

  useEffect(() => {
    const getPurchases = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/purchases/${currentAccount}`);
        setPurchases(response.data);
      } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
      }
    };
    if (currentAccount) {
      getPurchases();
    }
  }, [currentAccount]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Compras
      </Typography>
      {purchases.length === 0 ? (
        <Typography variant="body1">No has realizado ninguna compra aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {purchases.map((purchase) => (
            <Grid item xs={12} sm={6} md={4} key={purchase._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {purchase.carId.brand} {purchase.carId.model}
                  </Typography>
                  <Typography variant="body2">
                    Fecha de Compra: {new Date(purchase.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Precio: {purchase.carId.price} PD</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default PurchaseHistory;
