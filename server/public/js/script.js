let dataPlot, dataPlot2, maxDataPoints;
maxDataPoints = 150;

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    username: "Funny8ee",
    password: "Funny8ee",
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
}
const client = mqtt.connect("WSS://e9079bc3a54a48bb859818346853e5d2.s2.eu.hivemq.cloud:8884/mqtt", options) // you add a ws:// url here
client.subscribe("mqtt")



const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
dataPlot = new Chart(ctx, {
        type: 'line',
        data: {
        labels: [],
        datasets: [{
            label: 'ECG',
            data: [],
            borderWidth: 1,
            borderColor: "#3e95cd"
        }]
        },
        options: {
            tension: 0.4,
            animation: {
                duration: 0
            }
        // scales: {
        //     y: {
        //     beginAtZero: true
        //     }
        // }
        }
    });
dataPlot2 = new Chart(ctx2, {
    type: 'line',
    data: {
    labels: [],
    datasets: [{
        label: 'PPG',
        data: [],
        borderWidth: 1,
        borderColor: "#3e95cd"
    }]
    },
    options: {
        tension: 0.4,
        animation: {
            duration: 0
        }
    // scales: {
    //     y: {
    //     beginAtZero: true
    //     }
    // }
    }
});

client.on("message", function (topic, payload) {
    console.log(payload.toString())
    const payloadJSON = JSON.parse(payload.toString());
    console.log(payloadJSON.label)
    console.log(payloadJSON.ecg)
    // alert([topic, payload].join(": "))
    addData(payloadJSON.label, payloadJSON.ecg);
    addData2(payloadJSON.label, payloadJSON.ppg);
});

function addData(label, data) {
    if (dataPlot.data.labels.length > maxDataPoints)    removeData();
    console.log(dataPlot.data.labels)
    console.log(dataPlot.data.datasets[0].data)
    // for (let i = 0; i < 13; i++) {
    //     dataPlot.data.labels.push(label[i])
    //     dataPlot.data.datasets[0].data.push(data[i])
    // }
    dataPlot.data.labels.push(label)
    dataPlot.data.datasets[0].data.push(data)
    dataPlot.update();
}

function addData2(label, data) {
    if (dataPlot2.data.labels.length > maxDataPoints)    removeData2();
    dataPlot2.data.labels.push(label)
    dataPlot2.data.datasets[0].data.push(data)
    dataPlot2.update();
}

function removeData() {
    dataPlot.data.labels.shift();
    dataPlot.data.datasets[0].data.shift();
}

function removeData2() {
    dataPlot2.data.labels.shift();
    dataPlot2.data.datasets[0].data.shift();
}


// client.publish("mqtt", "hello world!")