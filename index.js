const { SerialPort } = require('serialport');

const port = new SerialPort({path:'COM3', baudRate:9600});

function sendSignal(signal) {
  port.write(signal, (err) => {
    if (err) return console.log('Error on write: ', err.message);
    console.log(`Sent: ${signal}`);
  });
}

async function checkCalendar() {
  const url = process.env.GAS_APP_URL;
  try {
    const response = await fetch(url);
    const data = await response.json();
  
    const isSprint = /^スプリント/.test(data.title);
    if (data.hasEvent && !isSprint) {
      console.log(`カレンダー予定あり: ${data.title}`);
      sendSignal('M');
    } else {
      console.log(`カレンダー予定なし`);
    }
  } catch (err) {
    console.error("GAS連携エラー:", err);
  }
}

// 1分ごとにカレンダーをチェック
setInterval(checkCalendar, 60000);

// 30分おきに「仕事に戻れ」を実行
setInterval(() => {
  console.log("30分経ちました！仕事に戻って！");
  sendSignal('R');
}, 1800000);

// 初回実行
checkCalendar();
setInterval(checkCalendar, 60000);