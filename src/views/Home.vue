<template>
	<div class="wrapper">
		<div class="container">
			<div class="convertor" v-if="select1">
				<div class="row">
					<span>
						Из
					</span>
					<select
						class="select"
						v-model="select1"
						@change="selectChanged"
					>
						<option>Ethereum (ETH)</option>
						<option selected>Bitcoin (BTC)</option>
						<option>US Dollar (USD)</option>
					</select>
					<span>
						В
					</span>
					<select
						class="select"
						v-model="select2"
						@change="selectChanged"
					>
						<option>Ethereum (ETH)</option>
						<option selected>Bitcoin (BTC)</option>
						<option>US Dollar (USD)</option>
					</select>
				</div>
				<div class="row">
					<span> {{ select1 }}: </span>
					<input
						class="input"
						v-model="input"
						@keyup="computeResult"
					/>
				</div>
				<div class="row-result row">
					<span> {{ select2 }}: </span>
					<div class="error" v-if="inputError">
						Введите корректное число
					</div>
					<div class="result" v-if="result">
						{{ result }}
					</div>
				</div>
				<div class="chart-header row">
					<span>График</span>
					<select
						class="select"
						v-model="chartSelect"
						@change="drawChart"
					>
						<option selected>BTC / USD</option>
						<option>ETH / USD</option>
					</select>
				</div>
				<RateChart
					v-if="loaded"
					:chartdata="chartData"
					:options="options"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import RateChart from "@/components/RateChart.vue"
import getRates from "@/api/getRates.ts"
import getCurRate from "@/api/getCurRate"

const btc = "Bitcoin (BTC)"
const etc = "Ethereum (ETH)"
const usd = "US Dollar (USD)"

export default Vue.extend({
	name: "Home",
	components: {
		RateChart,
	},
	created(){
		document.title = "Конвертер криптовалют"
	},
	async beforeMount() {
		await this.$store.dispatch("changeEthereumValue")
		await this.$store.dispatch("changeBitcoinValue")
		this.currentRate = this.$store.state.bitcoinValue
		this.updateDataRates("bitcoin")
	},
	data() {
		return {
			select1: btc,
			select2: usd,
			chartSelect: "BTC / USD",
			input: "",
			inputError: false,
			currentRate: 2,
			result: 0,
			loaded: false,
			chartData: {
				labels: <string[]>[],
				datasets: [
					{
						label: "BTC / USD",
						backgroundColor: "#A1FCCA",
						fontSize: 18,
						data: <number[]>[],
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					labels: {
						fontColor: "black",
						fontSize: 16,
					},
				},
			},
		}
	},
	methods: {
		selectChanged(event: any) {
			this.input = ""
			this.result = 0
			const bitCache = this.$store.state.bitcoinValue
			const etcCache = this.$store.state.ethereumValue
			if (
				(this.select1 === btc && this.select2 === btc) ||
				(this.select1 === etc && this.select2 === etc) ||
				(this.select1 === usd && this.select2 === usd)
			) {
				this.currentRate = 1
			} else if (this.select1 === btc && this.select2 === usd) {
				this.currentRate = bitCache
			} else if (this.select1 === usd && this.select2 === btc) {
				this.currentRate = 1 / bitCache
			} else if (this.select1 === etc && this.select2 === usd) {
				this.currentRate = etcCache
			} else if (this.select1 === usd && this.select2 === etc) {
				this.currentRate = 1 / etcCache
			} else if (this.select1 === btc && this.select2 === etc) {
				this.currentRate = bitCache / etcCache
			} else if (this.select1 === etc && this.select2 === btc) {
				this.currentRate = etcCache / bitCache
			}
		},
		drawChart() {
			if (this.chartSelect === "BTC / USD") {
				this.chartData.datasets[0].label = "BTC / USD"
				this.updateDataRates("bitcoin")
			} else {
				this.chartData.datasets[0].label = "ETC / USD"
				this.updateDataRates("ethereum")
			}
		},
		async updateDataRates(crypto: string) {
			this.loaded = false
			// ethereum or bitcoin
			const data = await getRates(crypto)
			let i = 0
			data.prices.forEach(item => {
				const date = new Date(item[0])
				const day =
					date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
				const month =
					date.getMonth() + 1 > 9
						? date.getMonth()
						: `0${date.getMonth() + 1}`
				const shortYear = date.getFullYear() % 1000
				const formatDate = `${day}.${month}.${shortYear}`
				this.chartData.labels[i] = formatDate
				this.chartData.datasets[0].data[i] = Math.round(item[1])
				i++
			})
			this.loaded = true
		},
		computeResult() {
			if (isNaN(Number(this.input))) {
				this.inputError = true
			} else {
				this.inputError = false
			}
			this.result = Number(this.input) * this.currentRate
			this.result =
				this.result % 1000 < 1
					? Number(this.result.toFixed(10))
					: Number(this.result.toFixed(2))
		},
	},
})
</script>
<style lang="sass" scoped>
.container
	min-height: 100vh
	width: 80%
	margin: 0 auto
	border-radius: 10px
	margin-top: 90px
	font-size: 24px
	display: flex
	align-items: center
	justify-content: center
.chart
	font-size: 20px
.convertor
	min-height: 710px
	width: 500px
	border-radius: 5px
	background-color: #28d778
	color: #fff
	padding: 15px
.error
	color: #f00
	font-size: 18px
	display: flex
	align-items: flex-end
.row
	display: flex
	justify-content: space-between
	margin-bottom: 15px
	&:nth-child(2)
		justify-content: start
		span
			margin-right: 7px
.row-result
	justify-content: start
	height: 20px
	span
			margin-right: 7px
.chart-header
	margin-top: 60px
	justify-content: center
	span
		margin-right: 10px
	.select
		width: 140px
.input
	justify-self: center
	width: 140px
	color: #fff
	background-color: #333
	border-radius: 5px
.select
	cursor: pointer
	background-color: #333
	color: #fff
	border: none
	width: 200px
	outline: none
	border-radius: 5px
</style>
