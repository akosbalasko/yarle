
var CryptoJS = require("crypto-js");

import * as crypto from 'crypto';
import * as base64 from 'base64-js';

// PBKDF2 implementation (modified for SHA256 support)
function pbkdf2(password: string, salt: Uint8Array, iterations: number, keyLength: number): Buffer {
  return crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
}

// HMAC implementation
function hmacSHA256(key: Buffer, data: Uint8Array): Buffer {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest();
}

// AES decryption
function decryptAES(ciphertext: Uint8Array, key: Buffer, iv: Uint8Array): Buffer {
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}
interface EncryptedData {
    salt: Uint8Array,
    saltHmac: Uint8Array,
    iv: Uint8Array,
    cipherText: Uint8Array,
    body: Uint8Array,
    bodyHmac: Uint8Array
}
const extractDataFromEncryptedByteArray = (data: Uint8Array):EncryptedData => {
    const START_INDEX = 4;
    const TWO_BYTES = 16;
    const START_SALTHMAC = START_INDEX + TWO_BYTES;
    const START_IV = START_SALTHMAC + TWO_BYTES;
    const START_CIPHERTEXT = START_IV + TWO_BYTES;
    const FOUR_END_BYTES = -32
    return {
        salt: data.subarray(START_INDEX, START_SALTHMAC),
        saltHmac: data.subarray(START_SALTHMAC, START_IV),
        iv: data.subarray(START_IV, START_CIPHERTEXT),
        cipherText: data.subarray(START_CIPHERTEXT, FOUR_END_BYTES),
        body: data.subarray(0, FOUR_END_BYTES),
        bodyHmac: data.subarray(FOUR_END_BYTES)

    }
}
export const performDecryption = (encryptedText: string, passwords: Array<string>): string => {
    try{
        const encryptedDataByteArr = base64.toByteArray(encryptedText);
        const encryptedData = extractDataFromEncryptedByteArray(encryptedDataByteArr);


        // Use the password to generate a digest for the encrypted body
        // If it matches the existing digest, assume the password is correct
        for (const password of passwords){
            const keyhmac = pbkdf2(password, encryptedData.saltHmac, 50000, 16);
            const testhmac = hmacSHA256(keyhmac, encryptedData.body);
            const matchHmac = crypto.timingSafeEqual(testhmac, encryptedData.bodyHmac);
            if (matchHmac) {
            const key = pbkdf2(password, encryptedData.salt, 50000, 16);
            const decrypted = decryptAES(encryptedData.cipherText, key, encryptedData.iv);

            return decrypted.toString()
            
            }
        }
    }catch(e: any){
        console.log(e.message)
    }
}
