// frontend/src/TokenBalanceWeb3.js
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { Web3Context } from './Web3Context';
import abi from './tokenABI.json'; 
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Icono representativo

function TokenBalanceWeb3() {
  const { currentAccount, web3Instance } = useContext(Web3Context);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Define esta variable en .env
  let tokenContract;

  if (web3Instance && contractAddress && abi) {
    tokenContract = new web3Instance.eth.Contract(abi, contractAddress);
  }

  const fetchBalance = async () => {
    if (!web3Instance || !contractAddress || !abi) {
      setError('Web3 no está inicializado correctamente.');
      setLoading(false);
      return;
    }

    try {
      const balanceWei = await tokenContract.methods.balanceOf(currentAccount).call();
      const balancePD = web3Instance.utils.fromWei(balanceWei, 'ether'); // Asumiendo 18 decimales
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
    } else {
      setLoading(false);
    }

    // Re-fetch el balance cada 60 segundos
    const interval = setInterval(() => {
      if (currentAccount && web3Instance) {
        fetchBalance();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentAccount, web3Instance]);

  if (!currentAccount) return null; // No mostrar si no hay cuenta conectada

  return (
    <Box
      sx={{
        padding: theme => theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: theme => theme.spacing(1),
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <Tooltip title={`Saldo: ${balance} PD`} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWalletIcon />
            <Typography variant="body1" sx={{ marginLeft: 0.5 }}>
              {balance} PD
            </Typography>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}

export default TokenBalanceWeb3;
