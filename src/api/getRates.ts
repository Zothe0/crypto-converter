interface IRateData {
	prices: Array<Array<number>>
	market_caps: Array<Array<number>>
	total_volumes: Array<Array<number>>
}
export default async function(crypto: string): Promise<IRateData> {
	const response = await fetch(
		`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=14&interval=daily`
	)
	return response.json()
}
