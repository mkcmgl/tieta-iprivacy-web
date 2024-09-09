import Encrypt from 'encryptlong';
export default function decrypt(privateKey, data) {
    const encryptor = new Encrypt();
    encryptor.setPrivateKey(privateKey);
    return encryptor.decryptLong(data);
}
