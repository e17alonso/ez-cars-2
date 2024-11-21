// frontend/src/TokenBalanceWeb3.js
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Web3Context } from './Web3Context';
import Web3 from 'web3';
import abi from './tokenABI.json';
; // Asegúrate de tener el ABI del contrato

function TokenBalanceWeb3() {
  const { currentAccount, web3Instance } = useContext(Web3Context);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Asegúrate de definir esta variable
  const tokenContract = new web3Instance.eth.Contract(abi, contractAddress);

  const fetchBalance = async () => {
    try {
      const balanceWei = await tokenContract.methods.balanceOf(currentAccount).call();
      const balancePD = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(balancePD);
    } catch (err) {
      console.error('Error al obtener el saldo con Web3:', err);
      setError('No se pudo obtener el saldo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount && web3Instance) {
      fetchBalance();
    }
    // Re-fetch el balance cada 60 segundos
    const interval = setInterval(() => {
      fetchBalance();
    }, 60000);
    return () => clearInterval(interval);
  }, [currentAccount, web3Instance]);

  if (!currentAccount) return null; // No mostrar si no hay cuenta conectada

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: 3,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <Typography variant="body1">
          🪙 <strong>Saldo PD:</strong> {balance}
        </Typography>
      )}
    </Box>
  );
}

export default TokenBalanceWeb3;
