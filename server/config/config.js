

// =============================
//              PUERTO
// =============================
process.env.PORT = process.env.PORT || 3000;


// =============================
//              ENTORNO
// =============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
//    VENCIMIENTO DEL TOKEN
// =============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// =============================
// SEED/Semilla de autenticación
// =============================

process.env.SEED = 'este-es-el-seed-desarrollo';

// =============================
//        BASE DE DATOS
// =============================

//let dbUser = encodeURIComponent('dbdu');
//let dbPassword = encodeURIComponent('qcNDRJCZWNC3cxe6');
let urlDB = null;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB =  'mongodb+srv://dbdu:qcNDRJCZWNC3cxe6@cafe-tydtb.mongodb.net/test?retryWrites=true';//process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =============================
//      Google CLiente ID
// =============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '265482724118-b89l72m3ubijgc1fu7kk1gpkslk2j6v2.apps.googleusercontent.com';