
export function getWeather(lat, lon, timezone) {
   return fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
     {
        params: {
        latitude:lat,
        longitude: lon,
        timezone,
            }
        }
    ).then(({data}) =>{
        console.log(data)
        return data
        return{
            current: parseCurrentWeather(data) ,
            daily:parseDailyWeather(data) ,
            hourly:parseHourlyWeather(data) ,
        }
    })
}
function parseCurrentWeather({current_weather, daily}){
    const {
        temperature: currentTemp,
         windSpeed: windSpeed, 
         weatherCode: iconCode
        } = current_weather
        const{
            temperature_2m_max: [maxTemp],
            temperature_2m_max: [minTemp],
            apparent_temperature_max: [maxFeelsLike],
            apparent_temperature_max: [minFeelsLike],
            precipitation_sum: [precip],
        } = daily
    // const maxTemp = daily.temperature_2m_max[0]
return{
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round (maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round (minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100)/100,
    iconCode,
}

}
function parseDailyWeather({daily}){
    return daily.time.map((time,index)=> {
        return{
            timestamp: time* 1000,
            iconCode: daily.temperature_2m_max[index],
            naxTemp: Math.round(daily.temperature_2m_max[index]),
        }
    })
}
function parseHourlyWeather({hourly,current_weather}){
    return hourly.time.map((time,index)=>{
        return{
            timestamp: time * 1000,
            iconCode: hourly.weatherCode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature_2m[index]),
            windSpeed: Math.round(hourly.windSpeed_10m[index]),
            precip: Math.round((hourly.precipitation[index]* 100)/ 100)
        }
    }).filter(({timestamp})=> timestamp>= current_weather.time*1000)
}