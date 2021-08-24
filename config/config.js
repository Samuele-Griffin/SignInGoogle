process.env.PORT = process.env.PORT || 3000;

process.env.ENV = process.env.ENV || 'dev';

process.env.SIGN = process.env.SIGN || 'secret';

process.env.EXPIRES = process.env.EXPIRES || 60 * 60 * 24 * 30;

let URL = 'mongodb://localhost:27017/cm24';

process.env.URL = URL;

process.env.CLIENT_ID = process.env.CLIENT_ID || '625335287082-dhkmt221i0eeo58esm579m0r1738e8dr.apps.googleusercontent.com';

process.env.SECRET = process.env.SECRET || 'PK6FAEUHPjCNK_6IXhvQZ_FK';