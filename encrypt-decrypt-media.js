const { scryptSync, createDecipheriv, createCipheriv } = require('crypto');
const fs = require('fs');

const encrypt = (filepath, output, algorithm, key, iv) => {
    const fileStream = fs.createReadStream(filepath);
    const outputFileStream = fs.createWriteStream(output);

    const cipher = createCipheriv(algorithm, key, iv);
    fileStream.pipe(cipher).pipe(outputFileStream);
    let encrypted;

    fileStream.on('data', (data) => {
        encrypted = cipher.update(data);
        console.log(JSON.stringify(encrypted));
        outputFileStream.write(encrypted);
    })

    fileStream.on('end', () => {
        outputFileStream.end();
    })
}

const password = 'nuppa';
const algorithm = 'aes-192-cbc';
let key = scryptSync(password, 'salt', 24);
let iv = Buffer.alloc(16, 0);

//encrypt('./sample.pdf', 'encPdf.enc', algorithm, key, iv);


const decrypt = (inputeFilePath, outputFilePath, algorithm, key, iv) => {
    const outputFileStream = fs.createWriteStream(outputFilePath);
    const inputReadStream = fs.ReadStream(inputeFilePath);

    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted;

    inputReadStream.on('data', (data) => {
        decrypted = decipher.update(data);
        console.log(JSON.stringify(decrypted));
        outputFileStream.write(decrypted);
    })

    inputReadStream.on('end', () => {
        outputFileStream.end()
    })
}

decrypt('encPdf.enc', 'decryptedPDF.pdf', algorithm, key, iv);