// frontend/src/Web3Context.js
import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [web3Instance, setWeb3Instance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Solicitar acceso a las cuentas
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        const web3 = new Web3(window.ethereum);
        setWeb3Instance(web3);
      } catch (error) {
        console.error('Error al conectar la wallet:', error);
      }
    } else {
      console.error('Metamask no está instalado.');
    }
  };

  useEffect(() => {
    connectWallet();

    // Escuchar cambios en la cuenta
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ currentAccount, web3Instance }}>
      {children}
    </Web3Context.Provider>
  );
};
