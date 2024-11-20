// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Web3 = require('web3');

// Importar Modelos
const Car = require('./models/Car');
const Purchase = require('./models/Purchase');

const app = express();
// Configurar CORS
const allowedOrigins = ['http://localhost:3000','https://ez-cars-2-6wjaajiyg-e17alonsos-projects.vercel.app','https://ez-cars-2.vercel.app']; // Añade aquí tus orígenes permitidos

app.use(cors({
  origin: function(origin, callback){
    // Permitir solicitudes sin origin (como Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'La política de CORS de este servidor no permite el acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Backend de Ez-Cars 2 en funcionamiento');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
})
.catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Configuración de Web3
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
if (!INFURA_PROJECT_ID) {
  console.error('Falta INFURA_PROJECT_ID en las variables de entorno');
}

const web3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);

const contractAddress = process.env.CONTRACT_ADDRESS;
const accountAddress = process.env.ACC_ADDRESS;
const privateKey = process.env.ACC_PRIVATE_KEY;

// Verificar Variables de Entorno
if (!contractAddress || !accountAddress || !privateKey) {
  console.error('Faltan algunas variables de entorno: CONTRACT_ADDRESS, ACC_ADDRESS, ACC_PRIVATE_KEY');
}

// Cargar ABI del Contrato
let tokenContract;
try {
  const contractABI = require('./abi.json');
  tokenContract = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Contrato inteligente cargado correctamente');
} catch (error) {
  console.error('Error al cargar el ABI del contrato:', error);
}

// Ruta para el Faucet
app.post('/api/faucet', async (req, res) => {
  const { toAddress, amount } = req.body;

  console.log(`Solicitud de Faucet recibida: toAddress=${toAddress}, amount=${amount}`);

  try {
    // Validar la dirección
    if (!web3.utils.isAddress(toAddress)) {
      console.warn('Dirección inválida:', toAddress);
      return res.status(400).send('Dirección inválida');
    }

    // Validar la cantidad solicitada
    const amountPD = parseFloat(amount);
    const maxAmount = 500; // Máximo permitido por solicitud

    if (isNaN(amountPD) || amountPD <= 0 || amountPD > maxAmount) {
      console.warn('Cantidad inválida solicitada:', amountPD);
      return res.status(400).send(`Cantidad inválida. El máximo es ${maxAmount} PD.`);
    }

    // Convertir PD a Wei
    const amountWei = web3.utils.toWei(amountPD.toString(), 'ether');
    console.log(`Cantidad en Wei: ${amountWei}`);

    // Configurar la transacción
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 220000;

    const tx = {
      from: accountAddress,
      to: contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: tokenContract.methods.transfer(toAddress, amountWei).encodeABI(),
      nonce: await web3.eth.getTransactionCount(accountAddress, 'latest'),
    };

    console.log('Transacción configurada:', tx);

    // Firmar la transacción
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    console.log('Transacción firmada');

    // Enviar la transacción
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transacción enviada, hash:', receipt.transactionHash);

    res.send({ txHash: receipt.transactionHash });
  } catch (error) {
    console.error('Error en /api/faucet:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

/**
 * Rutas para Autos
 */

// Agregar un nuevo auto
app.post('/api/cars', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    console.log('Auto enlistado:', car);
    res.send('Auto enlistado');
  } catch (error) {
    console.error('Error en /api/cars (POST):', error);
    res.status(500).send('Error al enlistar el auto');
  }
});

// Obtener todos los autos disponibles (no vendidos)
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find({ sold: false });
    console.log(`Obtenidos ${cars.length} autos disponibles`);
    res.send(cars);
  } catch (error) {
    console.error('Error en /api/cars (GET):', error);
    res.status(500).send('Error al obtener los autos');
  }
});

// Actualizar el estado de un auto (marcar como vendido)
app.put('/api/cars/:id', async (req, res) => {
  try {
    await Car.findByIdAndUpdate(req.params.id, { sold: true });
    console.log(`Auto con ID ${req.params.id} marcado como vendido`);
    res.send('Auto actualizado');
  } catch (error) {
    console.error('Error en /api/cars/:id (PUT):', error);
    res.status(500).send('Error al actualizar el auto');
  }
});

/**
 * Rutas para Compras
 */

// Registrar una compra
app.post('/api/purchases', async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    console.log('Compra registrada:', purchase);
    res.send('Compra registrada');
  } catch (error) {
    console.error('Error en /api/purchases (POST):', error);
    res.status(500).send('Error al registrar la compra');
  }
});

// Obtener historial de compras de un usuario
app.get('/api/purchases/:buyerAddress', async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyerAddress: req.params.buyerAddress }).populate('carId');
    console.log(`Obtenidas ${purchases.length} compras para ${req.params.buyerAddress}`);
    res.send(purchases);
  } catch (error) {
    console.error('Error en /api/purchases/:buyerAddress (GET):', error);
    res.status(500).send('Error al obtener el historial de compras');
  }
});

// Iniciar el Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
