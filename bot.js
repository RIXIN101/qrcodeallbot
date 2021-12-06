const TelegramBot = require('node-telegram-bot-api');
const encodingJapanese = require('encoding-japanese');
const QRCode = require('qrcode');
const utf8 = require('utf8');
const TOKEN = '5006595568:AAHgH1G0bBx2_PEqoNTJe7BdfQoLWGjsXT8';
const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, 'Приветсвуем вас в нашем боте.\nОн позволяет генерировать QR коды для любого текста, который вы хотите.\nБудь то _ссылки_ или просто _текст_, который вы хотите передать кому-либо в виде QR кода!', {parse_mode: "Markdown"});
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, 'Нашим ботом очень просто пользоваться. Просто введите _текст_ или _ссылку_, которую хотите видеть после сканирования QR кода и вам в течении нескольких секунд сразу отправится ответ!', {parse_mode: "Markdown"})
});

bot.on('message',  msg => {
    if (msg.text != '/start' && msg.text != '/help') {
        if (msg.text == undefined || msg.sticker != undefined) {
            bot.sendMessage(msg.chat.id, 'Тот формат данных, который вы нам отправили не поддерживается, но в скором времени мы это исправим!');
        } else {
            const text = msg.text;
            QRCodeGenerator(text).then(response => {
                bot.sendPhoto(msg.chat.id, response);
            });
        }
    }
    
});

const QRCodeGenerator = (text) => {
    return new Promise((resolve, reject) => {
        QRCode.toFile('./qr_code_data/qrcode.png', utf8.encode(text), (err) => {
            if (err) reject(err);
            console.log('Success generate QRCode');
            resolve('./qr_code_data/qrcode.png');
        });
    });
};