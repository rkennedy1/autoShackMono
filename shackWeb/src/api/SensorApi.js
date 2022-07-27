export const SensorApi = (route) => {
    let temperature = [];
    let humidity = [];
    let flow = [];
    fetch('http://raspberrypi.local:3001/data/' + route)
        .then((response) => response.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                if (json[i].temperature && json[i].humidity) {
                    let date = new Date(json[i].datetime);
                    temperature.push({ x: date, y: json[i].temperature });
                    humidity.push({ x: date, y: json[i].humidity });
                    flow.push({ x: date, y: json[i].flow_rate * 10 });
                }
            }
            temperature.sort((a, b) => a.x - b.x);
            humidity.sort((a, b) => a.x - b.x);
            flow.sort((a, b) => a.x - b.x);
            return [temperature, humidity, flow];
        });
};

export default SensorApi;
