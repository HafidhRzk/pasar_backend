const { SodiumPlus, CryptographyKey } = require('sodium-plus');
const moment = require('moment');

exports.totalPage = (totalData, dataperPage = 10) => {
  if (totalData == 0) {
    return 0;
  }
  return Math.ceil(totalData / dataperPage);
};

exports.formatNumber = (angka) => {
  if (!angka || isNaN(angka)) {
    return angka;
  }

  angka = Math.round((Number(angka) + Number.EPSILON) * 100) / 100; // round to two decimal
  angka = angka.toString().replace(/\./g, '.');
  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.rupiah = (angka) => {
  angka = angka.toString().replace(/\./g, ',');
  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.rupiahRp = (angka) => {
  let data = parseFloat(angka);
  data = data.toString().replace(/\./g, '');
  const parts = data.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] || '00';
  return `${integerPart}`;
};

exports.randomName = (length = 10) => {
  const crypto = require('crypto');
  const randomStr = crypto.randomBytes(length).toString('hex');
  const time = new Date().getTime();
  const name = `${randomStr}_${time}`;

  return name;
};

exports.replaceAll = (str, mapObj) => {
  const re = new RegExp(Object.keys(mapObj).join('|'), 'gim');
  return str.replace(re, function (matched) {
    return mapObj[matched];
  });
};

exports.formatDateCustom = (date, format) => {
  try {
    if (date == null) {
      return null;
    } else {
      return moment(date).format(format);
    }
  } catch (error) {
    return '';
  }
};

exports.encrypt = async (txt) => {
  let sodium = await SodiumPlus.auto();

  const CRYPT_KEY = process.env.CRYPT_KEY;
  const keyBuffer = Buffer.from(CRYPT_KEY, 'hex');

  const key = new CryptographyKey(keyBuffer);
  const nonce = await sodium.randombytes_buf(24);

  let ciphertext = await sodium.crypto_secretbox(`${txt}`, nonce, key);
  const encryptedTxt = Buffer.concat([nonce, ciphertext]).toString('hex');

  return encryptedTxt;
};

exports.decrypt = async (encryptedTxt) => {
  let sodium = await SodiumPlus.auto();

  const CRYPT_KEY = process.env.CRYPT_KEY;
  const keyBuffer = Buffer.from(CRYPT_KEY, 'hex');

  const key = new CryptographyKey(keyBuffer);

  const decoded = Buffer.from(encryptedTxt, 'hex');
  const nonce = decoded.slice(0, 24);
  const cipher = decoded.slice(24);
  const decrypted = await sodium.crypto_secretbox_open(cipher, nonce, key);

  return decrypted.toString('utf-8');
};

exports.number = (x) => {
  const data = x.split(',');
  const initialValue = '';
  const sumWithInitial = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  const news = parseInt(sumWithInitial);
  return news;
};

exports.terbilang = (x) => {
  const angka = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];

  if (x < 12) return ` ${angka[Math.floor(x)]}`;
  else if (x < 20) return `${module.exports.terbilang(x - 10)} belas`;
  else if (x < 100)
    return `${module.exports.terbilang(x / 10)} puluh${module.exports.terbilang(
      x % 10
    )}`;
  else if (x < 200) return `seratus${module.exports.terbilang(x - 100)}`;
  else if (x < 1000)
    return `${module.exports.terbilang(
      x / 100
    )} ratus${module.exports.terbilang(x % 100)}`;
  else if (x < 2000) return `seribu${module.exports.terbilang(x - 1000)}`;
  else if (x < 1000000)
    return `${module.exports.terbilang(
      x / 1000
    )} ribu${module.exports.terbilang(x % 1000)}`;
  else if (x < 1000000000)
    return `${module.exports.terbilang(
      x / 1000000
    )} juta${module.exports.terbilang(x % 1000000)}`;
  else if (x < 1000000000000)
    return `${module.exports.terbilang(
      x / 1000000000
    )} milyar${module.exports.terbilang(x % 1000000000)}`;
};
