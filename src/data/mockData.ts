export const apiaryData = {
  apiary_name: "Via Roma, 32",
  hive_id: "Hive 4",
  hive_health_score: 92,
  varroa_detected: true,
  total_bees: 1420,
  env_data: { temp: 24.5, humidity: 42 },
  alert_crops: [
    "https://images.pexels.com/photos/1111318/pexels-photo-1111318.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/326138/pexels-photo-326138.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/2260537/pexels-photo-2260537.jpeg?auto=compress&cs=tinysrgb&w=400",
  ],
  hourly_activity: [0, 0, 0, 10, 50, 200, 450, 800, 950, 1100, 900, 600, 400, 200, 150, 80, 30, 10, 0, 0, 0, 0, 0, 0],
  hourly_activity_yesterday: [0, 0, 0, 5, 30, 160, 380, 720, 870, 980, 820, 550, 360, 180, 130, 70, 25, 8, 0, 0, 0, 0, 0, 0],
  hourly_temp: [18.2, 17.8, 17.5, 17.4, 17.6, 18.1, 19.3, 20.8, 22.1, 23.4, 24.5, 25.2, 25.8, 25.6, 25.0, 24.5, 23.8, 23.0, 22.2, 21.5, 20.8, 20.2, 19.6, 19.0],
  hourly_humidity: [55, 56, 57, 58, 57, 55, 52, 50, 48, 46, 44, 42, 41, 40, 41, 42, 43, 44, 46, 48, 50, 52, 53, 54],
  device: {
    battery: 85,
    solar_charging: true,
    signal: "LTE-M",
  },
};
