https://projects.100xdevs.com/tracks/w5E6PT2t0IyOFM3bZxcM/aws-fe-1

storage - object stores - s3

when you upload image on any object store then via object store url you should not give permition to access it you should use cdn for copple of reasons

1 ) cacheing(single source of truth) - if you have deploy your image on usa object store then if user from india want to access that image then first
you req reaches to CDN server in india and check the cache if not found then req goes to usa server fetch the image and add in 
the indian server cache and server to user and when again req comes for same image it usage that cache to serve it.

so you do not use your image object store url you use cdn url 

so cdn.urvish.aws.com/a.mp4 -> which points to -> (sourse) s3.urvish.cms.aws.com

so on cloudfront i have to create distribution that this is my source url and it will give me diff url which points to same assert, but it does something extra

so when you are creating a s3 bucket bock all the access by defalut and letter on only give permition to cdn to access it


aws has cloudfront as cdn

CDN - contect delivery network 

Object store      CDN

storage         distribution 

2GB uses        20 Gb of bandwith is consumened (if 100 people visites it)

$0.02 per month /   $0.01 daller for distribution



// diff video for s3 stroge with cdn(see image 1 and 2) code is bellow and watch the video
https://www.youtube.com/watch?v=qlvBBryYB2Q

import express from 'express';
import cors from 'cors';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { connectToDB } from './db';
import { ProductModel } from './product-model';

const app = express();
app.use(cors());
app.use(express.json());

const port = 3200;

/**
 * Initalise the database
 */
await connectToDB();

/**
 * Initialise s3 client
 */
const client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const createPresignedUrlWithClient = ({ bucket, key }) => {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
};

app.post('/api/get-presigned-url', async (req, res) => {
    const { mime } = req.body;

    // Get the presigned url from s3
    const filename = uuidv4();
    const finalName = `${filename}.${mime}`;

    const url = await createPresignedUrlWithClient({
        bucket: process.env.S3_BUCKET_NAME,
        key: finalName,
    });

    res.json({ url: url, finalName: finalName });
});

app.post('/api/products', async (req, res) => {
    // get data from request
    const { name, description, price, filename } = req.body;

    // todo: validate the request using zod
    if (!name || !description || !price || !filename) {
        res.json({ message: 'All fields are required!' });
        return;
    }

    // Save to database
    // todo: handle error
    const product = await ProductModel.create({
        name,
        description,
        price,
        filename,
    });

    console.log('product', product);

    res.json({ message: 'success!' });
});

app.get('/api/products', async (req, res) => {
    const products = await ProductModel.find();
    res.json(products);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});