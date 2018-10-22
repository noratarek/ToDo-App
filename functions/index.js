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