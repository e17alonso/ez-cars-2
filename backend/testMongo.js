// backend/testMongo.js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB exitosamente');
  mongoose.connection.close();
})
.catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});
