import Encrypt from 'encryptlong';
export default function encrypt(publicKey, data) {
    const encryptor = new Encrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encryptLong(data);
}
