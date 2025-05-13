const express = require('express');
const app = express();
const path = require('path');

let orders = [];

app.use(express.json());
app.use(express.static('public'));

app.post('/order', (req, res) => {
  const { address, itemCount, name, phone } = req.body;
  if (address && itemCount && name && phone) {
    orders.push({ address, itemCount, name, phone });
    res.status(200).json({ message: 'Order received' });
  } else {
    res.status(400).json({ error: 'Invalid order' });
  }
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
