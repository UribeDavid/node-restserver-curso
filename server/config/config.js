

// =============================
//              PUERTO
// =============================
process.env.PORT = process.env.PORT || 3000;


// =============================
//              ENTORNO
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =============================
//        BASE DE DATOS
// =============================

let dbUser = encodeURIComponent('dbdu');
let dbPassword = encodeURIComponent('qcNDRJCZWNC3cxe6');
let urlDB = null;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = `mongodb+srv://${dbUser}:${dbPassword}@cafe-tydtb.mongodb.net/test?retryWrites=true&w=majority`;
}

process.env.URLDB = urlDB;
