<template>
	<view class="page">
		<van-search :value="value" placeholder="搜索" v-on:change="bindKeyInput" />
		<view class="container-inner">
			<view class="side-bar-letter-list touch-class">
				<view class="side-bar-hot-city" @tap="hotCity"><view style="margin-top:0;">热</view></view>
				<view v-for="(item, index) in sideBarLetterList" style="color:#35B1A7;font-size:20rpx;" :key="index" :data-letter="item.name" @touchend="touchSideBarLetter">
					{{ item.name }}
				</view>
			</view>
			<view class="container">
				<block v-if="showChosenLetterToast">
					<view class="show-chosen-letter">{{ toastShowLetter }}</view>
				</block>

				<scroll-view :scroll-y="true" :style="{ height: winHeight + 'px' }" @scroll="bindScroll" :scroll-into-view="scrollTopId" :scroll-top="scrollTop">
					<ul class="ul">
						<li v-for="(citys, k) in completeList" :key="k" @tap="chooseCity" :data-city="citys.city" :data-code="citys.code" class="li">{{ citys.city }}</li>
					</ul>

					<!-- <view class="county-picker">
						<view v-if="showCountyPicker" class="county-picker-title">选择区县</view>
						<view v-if="showCountyPicker" class="county">
							<block class="county-picker-list" v-for="(countys, j) in countyList" :key="j">
								<view class="weui-grid" :data-code="countys.id" :data-city="countys.fullname" @tap="chooseCounty">
									<view class="weui-grid-label">{{ countys.fullname }}</view>
								</view>
							</block>
						</view>
					</view> -->

					<view class="city-picker">
						<view class="hotcity-common" @tap="reGetLocation">点击定位城区</view>
						<view class="current-city" @tap="reGetLocation" :data-city="city" :data-code="currentCityCode" :data-county="county">{{ city }} {{ county }}</view>

						<view class="hotcity-common">热门城市</view>

						<view class="hot-city" :key="initial">
							<view v-for="(item, i) in hotCityList" :key="i">
								<view class="weui-grid" :data-code="item.cityCode" :data-city="item.city" @tap="chooseCity">
									<view class="weui-grid-label">{{ item.city }}</view>
								</view>
							</view>
						</view>
					</view>

					<view class="selection" v-for="(item, i) in cityList" :key="i">
						<view class="item-letter" :id="item.initial">{{ item.initial }}</view>
						<view class="item-city" v-for="(ct, k) in item.cityInfo" :key="k" :data-code="ct.code" :data-city="ct.city" @tap="chooseCity">{{ ct.city }}</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { LETTERS, HOT_CITY_LIST } from '../../../common/citydata';
import { commonMessage } from '../../../common/commonMessageZhCn';
import { AutoPredictor } from '../../../common/autoPredictor';
import utils from '../../../common/util';

const { isNotEmpty, safeGet, getCityListSortedByInitialLetter, getLocationUrl, getCountyListUrl, getIndexUrl, onFail } = utils;
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			value: '',
			sideBarLetterList: [],
			winHeight: 0,
			cityList: [],
			hotCityList: HOT_CITY_LIST,
			toastShowLetter:'',
			showChosenLetterToast: false,
			scrollTop: 0, //置顶高度
			scrollTopId: '', //置顶id
			city: commonMessage['location.getting'],
			currentCityCode: '',
			inputName: '',
			completeList: [],
			county: '',
			showCountyPicker: false,
			auto: true // 自动手动定位开关
		};
	},
	onShareAppMessage() {
		let token = uni.getStorageSync('TOKEN');
		let user = uni.getStorageSync('userInfo');
		if (token) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/index?server=' + user.server_people_id
			};
		}
	},
	onLoad: function() {
		// 生命周期函数--监听页面加载
		const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
		const sysInfo = wx.getSystemInfoSync();
		const winHeight = sysInfo.windowHeight;
		const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
		this.winHeight = winHeight;
		this.sideBarLetterList = sideBarLetterList;
		this.cityList = cityListSortedByInitialLetter;

		// 定位
		this.getLocation();
	},
	methods: {
		...mapMutations(["setCity"]),
		touchSideBarLetter: function(e) {
			const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e);
			console.log(chosenLetter)
			this.toastShowLetter = chosenLetter;
			this.showChosenLetterToast = true;
			this.scrollTopId = chosenLetter;
			// close toast of chosenLetter
			setTimeout(() => {
				this.showChosenLetterToast = false;
			}, 500);
		},
		//选择城市
		chooseCity: function(e) {
			const { city, code } = safeGet(['currentTarget', 'dataset'], e);
			this.auto = false;
			this.showCountyPicker = true;
			this.city = city;
			this.currentCityCode = code;
			this.scrollTop = 0;
			this.completeList = [];
			this.county = '';
			uni.setStorageSync('city', city);
			this.setCity(city);
			this.getCountyList();

			// appInstance.globalData.defaultCity = city;
			// appInstance.globalData.defaultCounty = '';
		},

		chooseCounty: function(e) {
			const county = safeGet(['currentTarget', 'dataset', 'city'], e);
			this.county = county;
			// appInstance.globalData.defaultCounty = county;
			// 返回首页
			uni.switchTab({ url: '/pages/index/index' });
		},

		//点击热门城市回到顶部
		hotCity: function() {
			this.scrollTop = 0;
		},
		bindScroll: function(e) {
			// console.log(e.detail)
		},
		getCountyList: function() {
			console.log(commonMessage['location.county.getting']);
			const code = this.currentCityCode;

			uni.request({
				url: getCountyListUrl(code),
				success: res => this.setCountyList(res),
				fail: onFail(commonMessage['location.county.fail'])
			});
		},

		setCountyList: function(res) {
			const resultArray = safeGet(['data', 'result'], res);
			const countyList = isNotEmpty(resultArray) ? resultArray[0] : [];

			this.countyList = countyList;
		},

		getLocation: function() {
			console.log(commonMessage['location.city.getting']);
			this.county = '';
			uni.getLocation({
				type: 'wgs84',
				success: res => this.getLocationFromGeoCoord(res),
				fail: onFail(commonMessage['location.city.fail'])
			});
		},

		getLocationFromGeoCoord: function(geoCoord) {
			const { latitude, longitude } = geoCoord;
			uni.request({
				url: getLocationUrl(latitude, longitude),
				success: location => this.setCityCounty(location)
			});
		},

		setCityCounty: function(location) {
			const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location);
			if (this.auto) {
				// 如果开始手动选择，以手动为准

				this.city = city;
				this.currentCityCode = adcode;
				this.county = district;

				// this.getCountyList();
			}
		},
		reGetLocation: function() {
			// const { city, county } = this.data;
			uni.setStorageSync('city', this.city);
			this.setCity(this.city);
			// appInstance.globalData.defaultCity = city;
			// appInstance.globalData.defaultCounty = county;
			//返回首页
			uni.switchTab({ url: '/pages/index/index' });
		},
		// 失焦时清空输入框
		bindBlur: function(e) {
			this.inputName = '';
			this.completeList = [];
		},
		// 输入框输入时
		bindKeyInput: function(e) {
			let inputName = e.detail.trim();
			this.inputName = inputName;
			if (!inputName) {
				this.completeList = [];
			}
			this.useAutoPredictor(inputName);
		},
		// 输入框自动联想搜索
		useAutoPredictor: function(content) {
			let autoPredictor = new AutoPredictor(content);
			let completeList = autoPredictor.associativeSearch();
			this.completeList = completeList;
		}
	}
};
</script>

<style lang="scss">
.container-inner {
	display: flex;
	flex-direction: row-reverse;
}

.container {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: 10rpx;
}

input {
	text-align: center;
	font-size: 32rpx;
	padding: 5px;
}

scroll-view {
	padding-left: 16rpx;
}

.side-bar-letter-list {
	flex-shrink: 0;
	width: 80rpx;
	text-align: center;
	display: flex;
	flex-direction: column;
	color: #666;
}

.side-bar-letter-list view {
	margin-top: 10rpx;
}

.touch-class {
	background-color: #fff;
	color: #fff;
	padding-top: 16rpx;
	padding-bottom: 16rpx;
}

.show-chosen-letter {
	background-color: rgba(0, 0, 0, 0.5);
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 50%;
	left: 50%;
	margin: -100rpx;
	width: 200rpx;
	height: 200rpx;
	border-radius: 20rpx;
	font-size: 52rpx;
	z-index: 1;
}

.selection {
	display: flex;
	width: 100%;
	flex-direction: column;
	margin-top: 10rpx;
}

.city-picker {
	padding: 16rpx 0 16rpx 16rpx;
	background-color: #f5f5f5;
	margin-bottom: -10rpx;
}
.county-picker {
	padding-left: 20rpx;
	margin-bottom: 10rpx;
}
.county-picker-title {
	font-size: 24rpx;
	color: #666;
	padding-bottom: 0;
	margin: 8rpx 0;
	padding-left: 4px;
}
.hot-city {
	background-color: #f5f5f5;
	margin-bottom: -10rpx;
	display: flex;
	flex-wrap: wrap;
}

.item-letter {
	display: flex;
	background-color: #f5f5f5;
	height: 40rpx;
	padding-left: 34rpx;
	align-items: center;
	font-size: 24rpx;
	color: #666;
}

.item-city {
	display: flex;
	background-color: #fff;
	height: 100rpx;
	padding-left: 34rpx;
	align-items: center;
	border-bottom: 1rpx solid #ededed;
	font-size: 24rpx;
	color: #666;
}

.hotcity-common {
	font-size: 24rpx;
	color: #666;
	padding-bottom: 0;
	margin: 8rpx 0;
	margin-left: 16rpx;
}

.county-picker-list {
	padding-right: 50rpx;
	margin: auto;
}

.current-city {
	display: inline-block;
	border: 1rpx solid #35b1a7;
	border-radius: 8rpx;
	padding: 10rpx;
	font-size: 24rpx;
	color: #35b1a7;
	text-align: center;
	min-width: 149.5rpx;
	margin: 16rpx;
}

.side-bar-hot-city {
	color: #35b1a7;
	font-size: 20rpx;
	margin: 0 !important;
}

.slectCity {
	border-color: #35b1a7 !important;
}

.slectCity view {
	color: #35b1a7 !important;
}

.weui-grid {
	padding: 10rpx;
	width: 200rpx;
	height: 70rpx;
	line-height: 50rpx;
	box-sizing: border-box;
	border: 1rpx solid #ececec;
	border-radius: 8rpx;
	background-color: white;
	margin: 8rpx 0 8rpx 8rpx;
}

.weui-grids {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.weui-grid-label {
	display: block;
	text-align: center;
	color: #333;
	font-size: 24rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.ul {
	display: block;
	color: grey;
	margin-left: 20rpx;
}

.li {
	display: block;
	font-weight: 100;
	font-size: 28rpx;
	padding: 16rpx 0;
}

input {
	background-color: #eee;
}

.input {
	padding: 16rpx;
	border-bottom: 1rpx solid #f1f1f1;
}

.county {
	display: flex;
	flex-wrap: wrap;
}
</style>
