export type WeatherData = {
	current: {
		temperature: {
			current: number | undefined;
			max: number | undefined;
			min: number | undefined;
		};
		weatherCode: number | undefined;
		humidity: number | undefined;
		rain: number | undefined;
		wind: {
			speed: number | undefined;
			direction: string | undefined;
		};
		uvIndex: number | undefined;
	};
	hourly: (number | Date)[][] | undefined;
	daily: {
		date: Date | undefined;
		weatherCode: number | undefined;
		temperature: {
			max: number | undefined;
			min: number | undefined;
		};
		uvIndex: number | undefined;
		rain: number | undefined;
		wind: {
			speed: number | undefined;
			direction: string | undefined;
		};
	}[];
};
