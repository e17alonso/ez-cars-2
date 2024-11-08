// frontend/src/Faucet.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, Typography, TextField, Box } from '@mui/material';
import { Web3Context } from './Web3Context';

function Faucet() {
  const { currentAccount } = useContext(Web3Context);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');

  const requestTokens = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage('Por favor, ingresa una cantidad válida de PD.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/faucet', {
        toAddress: currentAccount,
        amount: amount, // Cantidad especificada por el usuario
      });
      setMessage(`Tokens enviados. Hash de la transacción: ${response.data.txHash}`);
    } catch (error) {
      console.error('Error al solicitar tokens:', error);
      setMessage('Error al solicitar tokens');
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        Faucet de PezDolares (PD)
      </Typography>
      <Typography variant="body1" gutterBottom>
        Dirección: {currentAccount}
      </Typography>
      <TextField
        label="Cantidad de PD a solicitar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />
      <Button variant="contained" color="primary" onClick={requestTokens}>
        Solicitar PD
      </Button>
      {message && (
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default Faucet;
