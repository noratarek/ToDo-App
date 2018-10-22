const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const path = require('path');
const gcs = require('@google-cloud/storage')();
const os = require('os');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const url = require('url');

admin.initializeApp();

function saveCode(productId, codes, start) {
  return new Promise((res, rej) => {
    admin.database().ref(`productCodes/${codes[start]}`).set({
      timestamp: (new Date().getTime()),
      productId: productId,
    })
    .then(() => {
      if (start < codes.length) {
        res(saveCode(productId, codes, start + 1));
      } else {
        res();
      }
    })
    .catch((err) => {
      // log error then continue with the import
      console.log(err);
      if (start < codes.length) {
        res(saveCode(productId, codes, start + 1));
      } else {
        res();
      }
    });
  });
}

exports.parseUploadedFile = functions.storage.object().onFinalize((object) => {
  return new Promise((res, rej) => {
    // Parse File and write codes to the codes node
    const filePath = object.name;
    const productId = path.dirname(filePath);
    const fileName = path.basename(filePath);
    var codeList = [""];
    // Check if the file was not an export
    if (productId !== 'exports') {
      // Download File
      console.log(object.bucket);
      const bucket = gcs.bucket(object.bucket);
      const tempFilePath = path.join(os.tmpdir(), fileName);
      bucket.file(filePath).download({
        destination: tempFilePath,
      }).then(() => {
          var codes = fs.readFileSync (tempFilePath, 'utf-8');
          codeList = codes.split(",");
          // Loop Over Codes
          saveCode(productId, codeList, 0).then(() => {
            res();
          })
          .catch((err) => {
            rej(err);
          });
      });
    }
  });
});

const app = express();
app.use(cors({ origin: true }));

app.get('/:productId', (req, res) => {
  const productId = req.params.productId;
  var productName = '';

  console.log('Started Execution');
  // Get the product Name
  admin.database().ref(`/product/${productId}`)
    .once('value', snap => {

      if (snap.exists()) {
        // Place a generic string if the name doesnt exist
        productName = (snap.val().name && snap.val().name.length > 0) ? snap.val().name : 'product';
      }
      console.log('productName:', productName);
      admin.database().ref('/productCodes').orderByChild('productId')
        .equalTo(productId)
        .once('value', snap => {
          // Parse codes into a CSV format
          const productCodes = snap.val();
          const csvFile = processRow(Object.keys(productCodes));
          console.log('CSV Parsed');

          // Create File name and file
          const fileName = `${productName}-${new Date().getTime()}.csv`;
          const stream = fs.createWriteStream(`/tmp/${fileName}`);
          stream.once('open', () => {
            stream.write(csvFile);
            stream.end();
            console.log('File Written');

            // Write to bucket
            const bucket = gcs.bucket('total-product-codes.appspot.com');
            const file = bucket.file(`exports/${fileName}`);
            fs.createReadStream(`/tmp/${fileName}`)
              .pipe(file.createWriteStream())
              .on('error', (err) => {
                // Handle upload error
                console.warn('Error writing File to storage: ', err);
                res.status(500).send(err);
              })
              .on('finish', () => {
                // Return file URL
                console.log('Success writing File to storage: ', getPublicUrl(fileName));
                res.status(200).send({
                  url: getPublicUrl(fileName)
                });
              });
          });
        });
    });
});

exports.exportToCsv = functions.https.onRequest(app);

function getPublicUrl(filename) {
  return `/exports/${filename}`;
}

const processRow = function (row) {
  let finalVal = '';
  for (let j = 0; j < row.length; j++) {
    let innerValue = row[j] === null ? '' : row[j].toString();
    if (row[j] instanceof Date) {
      innerValue = row[j].toLocaleString();
    }
    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) {
      result = '"' + result + '"';
    }
    if (j > 0) {
      finalVal += ',';
    }
    finalVal += result;
  }
  return finalVal + '\n';
};