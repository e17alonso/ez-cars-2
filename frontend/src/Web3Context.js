// frontend/src/Web3Context.js
import React, { createContext, useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        try {
          // Solicitar acceso a las cuentas
          await provider.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(provider);

          const accounts = await web3.eth.getAccounts();
          setCurrentAccount(accounts[0]);

          // Escuchar cambios en la cuenta
          provider.on('accountsChanged', (accounts) => {
            setCurrentAccount(accounts[0]);
          });
        } catch (error) {
          console.error('Error al conectar con MetaMask:', error);
        }
      } else {
        console.error('Por favor, instala MetaMask!');
      }
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ currentAccount }}>
      {children}
    </Web3Context.Provider>
  );
};
