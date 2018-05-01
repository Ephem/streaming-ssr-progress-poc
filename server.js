import express from 'express';
import iconv from 'iconv-lite';
import React from 'react';
import { renderToStaticNodeStream } from 'react-dom/server';

import App from './App';

const app = express();

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const lorem =
    "Bacon ipsum dolor amet venison nisi nulla sunt, dolor quis elit eu in beef ribs duis sed shankle adipisicing. Kevin pork venison, corned beef pork loin est pastrami drumstick sausage salami. Commodo do laboris dolor tempor turkey aliqua jerky kevin landjaeger in nulla picanha beef. Officia in landjaeger laborum, sed magna non chuck fugiat tail sausage consequat tenderloin dolore. Pork shoulder prosciutto, venison deserunt quis salami nisi rump pork loin minim. Excepteur ribeye ea, ball tip ut velit ex sint sunt chuck nulla sausage pancetta.";
async function* getBacon() {
    yield 20;
    await delay(200);
    yield 40;
    await delay(200);
    yield 60;
    await delay(200);
    yield 80;
    await delay(200);
    yield 100;
    yield lorem;
}

async function* getChunk() {
    let converterStream = iconv.decodeStream('utf-8');
    let streamEnded = false;

    converterStream.on('end', () => streamEnded = true);

    function getDataFromStream() {
        return new Promise(resolve => {
            converterStream.once('data', (data) => {
                converterStream.pause();
                resolve(data);
            });
            if (converterStream.isPaused()) {
                converterStream.resume();
            }
        });
    }

    async function* getAllDataFromStream() {
        while (!streamEnded) {
            yield await getDataFromStream();
        }
    }

    yield`
<html style="margin:0;padding:0;overflow:scroll;">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Streaming progress bar</title>
        <style>
            html::-webkit-scrollbar {
                -webkit-appearance: none;
            }
            html::-webkit-scrollbar:vertical {
                width: 11px;
            }

            html::-webkit-scrollbar:horizontal {
                height: 11px;
            }

            html::-webkit-scrollbar-thumb {
                border-radius: 8px;
                border: 2px solid white;
                background-color: rgba(0, 0, 0, .5);
            }

            html::-webkit-scrollbar-track { 
                background-color: #fff; 
                border-radius: 8px; 
            } 
        </style>
    </head>
    <body style="margin:0;padding:0;">
        <div style="position:relative;height:10px;">
            <div id="progress2" style="position:absolute;background-color:#00ff00;width:20px;height:100%;transition:width 400ms;"></div>
            <div id="progress" style="position:absolute;background-color:#ff0000;width:0;height:100%;transition:width 400ms;"></div>
        </div>
        <script>
        window.setProgress = function setProgress(p, s) {
            if (s) {
                document.querySelectorAll('#progress2')[0].style.width = p + "%";
            } else {
                document.querySelectorAll('#progress')[0].style.width = p + "%";
            }
        };
        </script>`;

    let bacon;

    for await (const b of getBacon()) {
        if (typeof b === 'number') {
            yield `<script>window.setProgress(${b}, true);</script>`;
        } else {
            bacon = b;
        }
    }

    renderToStaticNodeStream(<App bacon={bacon} />).pipe(converterStream);
    yield* getAllDataFromStream();
    yield `
    </body>
</html>
`;
}

app.get('/', async (req, res) => {
    for await (const chunk of getChunk()) {
        res.write(chunk);
    }
    res.end();
});

app.listen(3000, () => {
    console.log('Listening to port 3000');
});
