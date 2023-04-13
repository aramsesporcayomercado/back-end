const {app} = require("./config/express");
require('dotenv').config();
require('./database');
const main = () => {
    app.listen(app.get("port"));
    console.log(`Server corriendo en servidor local:${app.get(`port`)}/`);

};
main();