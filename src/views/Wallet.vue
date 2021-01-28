<template>
	<div class="wrapper">
		<div class="container">
			<div class="wallet">
				<div class="wallet__header">Ваш портфель</div>

				<div class="buy">
					<div class="row">
						<span>
							Купить
						</span>
						<select
							class="buy__select select"
							v-model="select1"
							@change="buySelect"
						>
							<option selected>Bitcoin (BTC)</option>
							<option>Ethereum (ETH)</option>
						</select>
						<span>
							на
						</span>
						<input
							class="buy__input input"
							v-model="buyInput"
							@keyup="buyInputChanged"
							@keypress.enter="buyClick"
						/>
						USD
					</div>
					<!-- Доллары берутся из воздуха -->
					<div class="row">
						<span>Вы получите:</span>
						<div v-if="buyResult" class="buy__result">
							{{ buyResult.toFixed(8) }}
						</div>
						<div class="buy__error" v-if="buyError">
							Введите корректное число
						</div>
						<button
							class="buy__button"
							@click="buyClick"
							v-if="buyResult"
						>
							Купить
						</button>
					</div>
				</div>
				<div class="buy">
					<div class="row">
						<span>
							Продать
						</span>
						<select
							class="buy__select select"
							v-model="select2"
							@change="sellSelect"
						>
							<option selected>Bitcoin (BTC)</option>
							<option>Ethereum (ETH)</option>
						</select>
						<span>
							количество:
						</span>
						<input
							class="buy__input input"
							v-model="sellInput"
							@keyup="sellInputChanged"
							@keypress.enter="sellClick"
						/>
					</div>
					<!-- Доллары берутся из воздуха -->
					<div class="row">
						<span>Вы получите:</span>
						<div class="buy__error" v-if="sellError">
							Введите корректное число
						</div>
						<div class="buy__error" v-if="walletError">
							У вас не достаточно валюты
						</div>
						<div v-if="sellResult" class="buy__result">
							{{ sellResult.toFixed(2) }}
						</div>
						<div v-if="sellResult" class="usd">USD</div>
						<button
							class="buy__button"
							@click="sellClick"
							v-if="sellResult"
						>
							Продать
						</button>
					</div>
				</div>
				<div class="wallet__amount">
					Общая стоимость портфеля: {{ amount.toFixed(2) }} $
				</div>
				<div class="wallet__crypto">
					<div class="wallet__row">
						Bitcoin (BTC): {{ bitcoinWallet.toFixed(8) }}
					</div>
					<div class="wallet__row">
						Ethereum (ETH): {{ ethereumWallet.toFixed(8) }}
					</div>
				</div>
				<div class="diagram-header">
					Распределение криптовалют в вашем кошельке
				</div>
				<div class="wallet__diagram">
					<CryptoPie
						v-if="loaded"
						:chartdata="chartData"
						:options="options"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import CryptoPie from "@/components/CryptoPie.vue"

export default Vue.extend({
	name: "Wallet",
	components: { CryptoPie },
	methods: {
		buySelect() {
			this.buyInput = ""
			this.buyResult = 0
			this.buyError=false
			if (this.select1 === "Bitcoin (BTC)") {
				this.buyCof = 1 / this.$store.state.bitcoinValue
			} else {
				this.buyCof = 1 / this.$store.state.ethereumValue
			}
		},
		buyInputChanged() {
			if (isNaN(Number(this.buyInput))) {
				this.buyError = true
			} else {
				this.buyError = false
			}
			this.buyResult = Number(this.buyInput) * this.buyCof
		},
		buyClick() {
			if (this.select1 === "Bitcoin (BTC)") {
				this.bitcoinWallet += this.buyResult
			} else {
				this.ethereumWallet += this.buyResult
			}
			this.amount =
				this.ethereumWallet * this.$store.state.ethereumValue +
				this.bitcoinWallet * this.$store.state.bitcoinValue
			this.drawDiagram()
			this.buyInput = ""
			this.buyResult = 0
		},
		sellSelect() {
			this.sellInput = ""
			this.sellResult = 0
			this.sellError=false
			this.walletError=false
			if (this.select1 === "Bitcoin (BTC)") {
				this.sellCof = this.$store.state.bitcoinValue
			} else {
				this.sellCof = this.$store.state.ethereumValue
			}
		},
		sellInputChanged() {
			if (isNaN(Number(this.sellInput))) {
				this.sellError = true
			} else {
				this.sellError = false
			}
			if (this.select2 === "Bitcoin (BTC)") {
				if (this.bitcoinWallet - Number(this.sellInput) < 0) {
					this.walletError = true
					this.sellResult = 0
				} else {
					this.sellResult = Number(this.sellInput) * this.sellCof
					this.walletError = false
				}
			} else {
				if (this.ethereumWallet - Number(this.sellInput) < 0) {
					this.walletError = true
					this.sellResult = 0
				} else {
					this.sellResult = Number(this.sellInput) * this.sellCof
					this.walletError = false
				}
			}
		},
		sellClick() {
			if (this.select2 === "Bitcoin (BTC)") {
				this.bitcoinWallet -= Number(this.sellInput)
			} else {
				this.ethereumWallet -= Number(this.sellInput)
			}
			this.amount =
				this.ethereumWallet * this.$store.state.ethereumValue +
				this.bitcoinWallet * this.$store.state.bitcoinValue
			this.drawDiagram()
			this.sellInput = ""
			this.sellResult = 0
		},
		drawDiagram() {
			this.loaded = false
			this.chartData.datasets[0].data[0] = this.ethereumWallet
			this.chartData.datasets[0].data[1] = this.bitcoinWallet
			setTimeout(() => {
				this.loaded = true
			}, 10)
		},
	},
	async beforeMount() {
		await this.$store.dispatch("changeEthereumValue")
		await this.$store.dispatch("changeBitcoinValue")
		this.drawDiagram()
		this.buyCof = 1 / this.$store.state.bitcoinValue
		this.sellCof = this.$store.state.bitcoinValue
		this.loaded = true
		this.amount =
			this.ethereumWallet * this.$store.state.ethereumValue +
			this.bitcoinWallet * this.$store.state.bitcoinValue
	},
	data() {
		return {
			ethereumWallet: 99.15,
			bitcoinWallet: 10.7779,
			amount: 0,
			walletError: false,
			buyCof: 0,
			buyInput: "",
			buyResult: 0,
			buyError: false,
			loaded: false,
			select1: "Bitcoin (BTC)",
			select2: "Bitcoin (BTC)",
			sellCof: 0,
			sellInput: "",
			sellResult: 0,
			sellError: false,
			chartData: {
				datasets: [
					{
						backgroundColor: ["#0CBCE2", "#C317FF"],
						data: <number[]>[],
					},
				],
				// These labels appear in the legend and in the tooltips when hovering different arcs
				labels: ["Ethereum", "Bitcoin"],
			},
			options: {
				legend: {
					labels: {
						fontColor: "black",
						fontSize: 14,
					},
				},
				datasetIndex: {},
				responsive: true,
				maintainAspectRatio: false,
			},
		}
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
	font-size: 16px
	display: flex
	align-items: center
	justify-content: center
.wallet
	min-height: 840px
	margin-bottom: 30px
	width: 500px
	border-radius: 5px
	background-color: #28D778
	color: #fff
	padding: 15px
	&__header
		font-size: 26px
		margin-bottom: 30px
	&__amount
		font-size: 22px
		margin-bottom: 20px
	&__crypto
		margin-bottom: 30px
	&__row
		display: flex
		margin-bottom: 10px
	&__diagram
		position: relative
		margin-bottom: 20px
.buy
	margin-bottom: 50px
	&__button
		border-radius: 5px
		background-color: #a1fcca
	&__result
		margin-right: 7px
	&__error
		color: #f00
.usd
	margin-right: 7px
.diagram-header
	margin-bottom: 15px
.input
	justify-self: center
	width: 90px
	margin-right: 7px
	color: #fff
	background-color: #333
	border-radius: 5px
.select
	cursor: pointer
	background-color: #333
	color: #fff
	border: none
	width: 137px
	outline: none
	border-radius: 5px
	margin-right: 10px
.row
	margin-bottom: 10px
	display: flex
	span
		margin-right: 10px
</style>
