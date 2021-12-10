const TelegramBot = require('node-telegram-bot-api');
const QRCode = require('qrcode');
const TOKEN = '5006595568:AAEnLGjRZSsYuneP5BBhY-YN3rItJfJxTD4';
const bot = new TelegramBot(TOKEN, {polling: true});
const fs = require('fs');

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, 'Приветсвуем вас в нашем боте.\nОн позволяет генерировать QR коды для любого текста, который вы хотите.\nБудь то _ссылки_ или просто _текст_, который вы хотите передать кому-либо в виде QR кода!', {parse_mode: "Markdown"});
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, 'Нашим ботом очень просто пользоваться. Просто введите _текст_ или _ссылку_, которую хотите видеть после сканирования QR кода и вам в течении нескольких секунд сразу отправится ответ!\n*Бот может работать некорректно на некоторых устройствах.*', {parse_mode: "Markdown"})
});

setInterval(() => {
    fs.readdir(`./qr_code_data`, (err, files) => {
        if (files.length > 50) {
            console.log(files);
            for(let i = 0; i <= files.length; i++) {
                fs.unlink(`./qr_code_data/${files[i]}`, err => {if (err) throw err;});
            }
        }
    })
}, 30000);

bot.on('message',  msg => {
    if (msg.text != '/start' && msg.text != '/help') {
        if (msg.text == undefined || msg.sticker != undefined) {
            bot.sendMessage(msg.chat.id, 'Тот формат данных, который вы нам отправили не поддерживается, но в скором времени мы это исправим!');
        } else {
            const text = msg.text;
            const id = msg.chat.id;
            QRCodeGenerator(text, id)
                .then(response => {
                    bot.sendPhoto(id, response);
                })
                .catch(err => {
                    bot.sendMessage(id, `Вы ввели максимально допустимое значение символов`)
                });

        }
    }
});

const QRCodeGenerator = (text, id) => {
    return new Promise((resolve, reject) => {
        QRCode.toFile(`./qr_code_data/${id}.png`, text, (err) => {
            if (err) reject(err);
            console.log('Success generate QRCode');
            resolve(`./qr_code_data/${id}.png`);
        });
    });
};