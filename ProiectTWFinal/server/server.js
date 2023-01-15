const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); //  middleware care stocheaza cererile
const app = express();
const loginRoutes = require('./routes/loginRoutes');
const alimentRoutes = require('./routes/alimentRoutes');
const dbRoutes = require('./routes/dbRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use(express.json({ limit: '20mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));
const port = Number.parseInt(process.env.PORT);

// putem vedea in consola ce request-uri trimitem
app.use(morgan('dev'));
app.use('', loginRoutes);
app.use('/aliments',alimentRoutes);
app.use('',dbRoutes);
app.use('',usersRoutes);
// pentru toate erorile ce pot aparea
app.use((req, res)=> {
    res.status(404);
    res.send('404: Request Not Implemented');
});

app.listen(port, () => console.log(`Server deschis pe port ${port}`));
