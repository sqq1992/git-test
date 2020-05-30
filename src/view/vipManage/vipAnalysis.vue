<template>
	<div class="m-content analysis" v-loading="loading">
		<div class="m-content-main main_height">
			<p class="header">
				会员生命周期分析
				<span class="font12 time">模型更新时间：{{time}}</span>
			</p>
			<div class="lifeCycle">
				<div id="charts" class="charts"></div>
				<div class="charts_link">
					<div class="charts_link_item" @click="goUerLink(item, index)" v-for="(item,index) in vipLists" :key="'vipLists_'+index"></div>
				</div>
				<ul class="vipAnalysis clearfix">
					<li v-for="(item,index) in vipLists" :key="'vipLists_'+index" class="f-fl">
						<el-tooltip placement="top">
						  	<div slot="content" v-if="index == 0">	会员列表中“未成交会员”数量，<br/>不支持修改
						  	</div>
						  	<div slot="content" v-else>
						  		最后交易时间距今{{item.dealSet.rType == 1 ? (item.dealSet.minLastTradeDate + '≤x≤' + item.dealSet.maxLastTradeDate) : (item.dealSet.rType == 0 ? ('≤' + item.dealSet.maxLastTradeDate) : ((item.dealSet.rType == 3) ? ('=' + item.dealSet.minLastTradeDate) : ('≥' + item.dealSet.minLastTradeDate)))}}<br />
						  		且累计成交次数{{item.dealSet.fType == 1 ? (item.dealSet.minTradeCount + '≤y≤' + item.dealSet.maxTradeCount) : (item.dealSet.fType == 0 ? ('≤' + item.dealSet.maxTradeCount) : ((item.dealSet.fType == 0) ? ('=' + item.dealSet.minTradeCount) : ('≥' + item.dealSet.minTradeCount)))}}
						  	</div>
						  	<span class="cursor" @click="changeThis(item,index)">{{item.name}} <i class="el-icon-information"></i></span>
						</el-tooltip>
					</li>
				</ul>
				<div class="charLoading" v-if="charLoading">计算中...</div>
			</div>
			<div class="lineDiv"></div>
			<p class="header m_b20">
				会员RF分析
				<span class="font12 time">数据更新时间：{{rfTime}}</span>
				<el-button v-if="tableData.length" @click="changeRf" size="small" type="text" class="m_l10">修改RF模型</el-button> <span class="red" v-if="aready">本月已修改过RF模型，请下月再修改</span>
			</p>
			<div class="rfTable">
				<ul class="everyUl clearfix headerTab">
					<li class="row_li head f-fl borderL">
						<span class="text-right leftHead">最后交易时间</span>
						<span class="leftHead">累计成交次数</span>
						<div class="solid"></div>
					</li>
					<li class="row_li f-fl head text-center" :class="{'liChoose': item.choose}" v-for="(item,index) in rowArr" :key="'rowArr_'+index">
						{{item.name}}
						<i @click="changeClick(item, index, 'rowArr')" class="el-icon-setting cursor" v-if="index < 5 && showIcon"></i>
					</li>
				</ul>
				<div class="clearfix">
					<ul class="everyUl f-fl">
						<li class="row_li borderL head text-center" :class="{'borderB': index == 5, 'liChoose': item.choose, 'rightBor': item.choose}" v-for="(item,index) in colArr" :key="'colArr_'+index">
							{{item.name}}
							<i @click="changeClick(item, index, 'colArr')" class="el-icon-setting cursor" v-if="index < 5 && showIcon"></i>
						</li>
					</ul>
					<ul class="f-fl rightTable" v-if="tableData.length">
						<li class="dataLi row_li f-fl text-center" :class="{'borderB': index > 29}" v-for="(item,index) in tableData" :key="'tableData_'+index">
						    <el-tooltip placement="top">
							  	<div slot="content">点击查看会员列表</div>
							  	<div class="cursor" @click="lookItem(item, index)">
							  		{{item | numFormat}}<br />
									占比：{{tableData[35] ? parseFloat(item * 100 / tableData[35]).toFixed(2) : 0}}%
							  	</div>
							</el-tooltip>
						</li>
					</ul>
					<ul class="f-fl rightTable" v-else>
						<li class="row_li f-fl text-center" :class="{'borderB': index > 29}" v-for="(item,index) in 36" :key="'num_'+index">
							--
						</li>
					</ul>
				</div>
				<div class="redborder tableborder" v-if="rowClick" ref="redborder"></div>
				<div class="blueborder tableborder" v-if="colClick" ref="blueborder"></div>
			</div>
			<div class="m_t20 m_l20" v-if="showIcon">
				<el-button size="small" @click="cancel()">取消</el-button>
				<el-button @click="sureChange" size="small" type="primary" class="m_l5">确定修改</el-button>
			</div>
		</div>
		<el-dialog
			class="inputSet"
		  	:title="title"
		  	@close="cancel(true)"
		  	style="margin-top: 15%;"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
		  	<div v-loading="loadingPage" v-if="changeChartDia">
		  		<div class="row_line">
			  		<span class="row_span">最后交易时间距今</span>
					<el-select class="dealWidth" v-model="rowSelect" placeholder="">
			      		<el-option :label="item.label" :value="item.value" v-for="(item, index) in chooseArr" :key="'chooseArr_'+index"></el-option>
			    	</el-select>
			    	<div class="inline_block" v-if="rowSelect == '1'">
			    		<el-input @blur="blurInp('numOne')" v-model.trim="numOne" class="inpWidth"></el-input>
			    		<span>至</span>
			    		<el-input @blur="blurInp('numTwo')" v-model.trim="numTwo" class="inpWidth"></el-input>
			    		<span>天</span>
			    	</div>
			    	<div class="inline_block" v-else>
			    		<el-input @blur="blurInp('timeDay')" v-model.trim="timeDay" class="dealWidth"></el-input>
			    		<span>天</span>
			    	</div>
			  	</div>
			  	<div class="row_line m_t20">
			  		<span class="row_span">且   累计成交次数</span>
					<el-select class="dealWidth" v-model="dealNum" placeholder="">
			      		<el-option :label="item.label" :value="item.value" v-for="(item, index) in chooseArr" :key="'chooseArr1_'+index"></el-option>
			    	</el-select>
			    	<div class="inline_block" v-if="dealNum == '1'">
			    		<el-input @blur="blurInp('dealOne')" v-model.trim="dealOne" class="inpWidth"></el-input>
			    		<span>至</span>
			    		<el-input @blur="blurInp('dealTwo')" v-model.trim="dealTwo" class="inpWidth"></el-input>
			    		<span>次</span>
			    	</div>
			    	<div class="inline_block" v-else>
			    		<el-input @blur="blurInp('dealDay')" v-model.trim="dealDay" class="dealWidth"></el-input>
			    		<span>次</span>
			    	</div>
			  	</div>
			  	<div class="errorMess"></div>
			  	<div class="text-right clickBut">
			  		<el-button size="small" @click="dialogVisible = false">取消</el-button>
			  		<el-button type="primary" @click="changeChart" size="small">确定</el-button>
			  	</div>
		  	</div>
		  	<div v-loading="loadingPage" v-else class="rfchange">
		  		<div class="row_line">
			  		<span class="row_span">{{changeR ? '最后交易时间R' : '累计成交次数F'}}</span>
					<el-select class="dealWidth" v-model="rSelect" placeholder="">
			      		<el-option :label="item.label" :value="item.value" v-for="(item, index) in chooseArr" :key="'chooseArr2_'+index"></el-option>
			    	</el-select>
			    	<div class="inline_block" v-if="rSelect == '1'">
			    		<el-input @blur="blurInp('rOne')" v-model.trim="rOne" class="inpWidth"></el-input>
			    		<span>至</span>
			    		<el-input @blur="blurInp('rTwo')" v-model.trim="rTwo" class="inpWidth"></el-input>
			    		<span>{{changeR ? '天' : '次'}}</span>
			    	</div>
			    	<div class="inline_block" v-else>
			    		<el-input @blur="blurInp('rDay')" v-model.trim="rDay" class="dealWidth"></el-input>
			    		<span>{{changeR ? '天' : '次'}}</span>
			    	</div>
			  	</div>
			  	<div class="text-right clickBut">
			  		<el-button size="small" @click="cancel(true);">取消</el-button>
			  		<el-button type="primary" @click="changeRfSure" size="small">确定</el-button>
			  	</div>
		  	</div>
		</el-dialog>
	</div>
</template>

<script>
  import dateFormat from './../../common/dateFormat';
  import http from './../../api/index.js';
  import echarts from 'echarts';
  import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				rSelect: '2',
				rOne: '',
				rTwo: '',
				rDay: '',
				changeR: true,
				changeChartDia: false,
				loading: false,
				rowClick: false,
				colClick: false,
				trueOrfalse: false,
				showIcon: false,
				title: '',
				dialogVisible: false,
				loadingPage: false,
				time: '',
				rfTime: '',
				vipLists: [{
					name: '兴趣会员',
					dealSet: {}
				}, {
					name: '新会员',
					dealSet: {}
				}, {
					name: '活跃会员',
					dealSet: {}
				}, {
					name: '沉睡会员',
					dealSet: {}
				}, {
					name: '流失会员',
					dealSet: {}
				}],
				chooseArr: [{
					label: '小于等于',
					value: '0'
				}, {
					label: '大于等于',
					value: '2'
				}, {
					label: '介于',
					value: '1'
				}, {
					label: '等于',
					value: '3'
				}],
				dealNum: '2',
				rowSelect: '2',
				numOne: '',
				numTwo: '',
				timeDay: '',
				dealOne: '',
				dealTwo: '',
				dealDay: '',
				rowArr: [{
					name: 'R≤--天',
					choose: false
				},{
					name: '--≤R≤--',
					choose: false
				},{
					name: '--≤R≤--',
					choose: false
				},{
					name: '--≤R≤--',
					choose: false
				},{
					name: 'R≥--',
					choose: false
				},{
					name: '汇总'
				}],
				colArr: [{
					name: 'F=--',
					choose: false
				},{
					name: 'F=--',
					choose: false
				},{
					name: 'F=--',
					choose: false
				},{
					name: 'F=--',
					choose: false
				},{
					name: 'F=--',
					choose: false
				},{
					name: '汇总'
				}],
				tableData: [],
				aready: false,
				chooseItem: {},
				rfItem: {},
				rfId: 0,
				charLoading: true
			}
		},
		mounted() {
			this.reList();
			this.starPeople();
		},
		methods: {
      lookItem(item, index) {			//点击查看会员列表
        point('37977.39400.39423');
				let colIndex = parseInt(index / 6);
				let rowIndex = index % 6;
				let dealOne = this.colArr[colIndex].lefts ? this.colArr[colIndex].lefts : '';
				let dealTwo = this.colArr[colIndex].rights ? this.colArr[colIndex].rights : '';
				let dealType = this.colArr[colIndex].types ? this.colArr[colIndex].types : '';
				let dateOne = this.rowArr[rowIndex].lefts ? this.rowArr[rowIndex].lefts : '';
				let dateTwo = this.rowArr[rowIndex].rights ? this.rowArr[rowIndex].rights : '';
				let dateType = this.rowArr[rowIndex].types ? this.rowArr[rowIndex].types : '';
				this.$router.push({
					path: '/vipList',
					query: {
						dealOne,
						dealTwo,
						dateOne,
						dateTwo,
						dateType,
						dealType
					}
				})
			},
      changeRf() {			//rf表格改变事件
        point('37977.39400.39422');
				this.showIcon = this.trueOrfalse;
				this.aready = !this.trueOrfalse;
			},
			changeRfSure() {			//弹框确定修改rf
				let left = this.rSelect == '1' ? this.rOne : this.rDay;
				let right = this.rSelect == '1' ? this.rTwo : this.rDay;
				if(this.rSelect == '1') {
					if(Number(left) > Number(right)) {
						this.$message.error('左侧数据不能大于右侧数据！');
						return
					}
				}
				if(!left || !right) {
					this.$message.error('数据不能为空！');
					return
				}
				if(this.rfItem.type == 'rowArr') {
					this.rowArr[this.rfItem.index].name = this.rSelect == 0 ? ('R≤' + left) : ((this.rSelect == 1) ? (left + '≤R≤' + right) : ((this.rSelect == 2) ? ('R≥' + right) : ('R=' + right)));
					this.rowArr[this.rfItem.index].lefts = left;
					this.rowArr[this.rfItem.index].rights = right;
					this.rowArr[this.rfItem.index].types = this.rSelect;
				} else {
					this.colArr[this.rfItem.index].name = this.rSelect == 0 ? ('F≤' + left) : ((this.rSelect == 1) ? (left + '≤F≤' + right) : ((this.rSelect == 2) ? ('F≥' + right) : ('F=' + right)));
					this.colArr[this.rfItem.index].lefts = left;
					this.colArr[this.rfItem.index].rights = right;
					this.colArr[this.rfItem.index].types = this.rSelect;
				}
				this.dialogVisible = false;
				this.cancel(true);
			},
			sureChange() {				//确定修改rf表格
				this.$confirm('每个月只有一次机会修改RF模型，确认保存当前模型？', '修改提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'info'
		        }).then(() => {
		        	let data = {};
		        	let dealSet = [];
		        	let newMap = new Map();
	        		this.colArr.some((colItem, colIndex) => {
        				this.rowArr.some((rowItem,rowIndex) => {
        					let col = (colIndex + 1) > 5 ? 'z' : (colIndex + 1);
        					let row = (rowIndex + 1) > 5 ? 'z' : (rowIndex + 1);
		        			let a = 'rf' + col + row;
		        			let obj = {};
		        			obj = {
	        					rType: rowItem.types,
		        				minLastTradeDate: rowItem.lefts,
		        				maxLastTradeDate: rowItem.rights,
		        				fType: colItem.types,
		        				minTradeCount: colItem.lefts,
		        				maxTradeCount: colItem.rights,
		        				timeType: 1
	        				}
		        			dealSet.push(obj);
		        			newMap.set(a, obj);
		        		});
		        	});
		        	// data.dealSet = JSON.stringify(newMap);
		        	data.dealSet = JSON.stringify(dealSet);
		        	data.id = this.rfId;
		        	this.loading = true;
		          	http({
						api_name: 'rfUpdate',
						vm: this,
						data: data
					}, (res) => {
						this.showIcon = false;
						this.reList();
					}, (error) => {this.showIcon = false;this.loading = false;});
		        }).catch(() => {

		        });
			},
			rfqueryUpdateRf(id) {
				http({
					api_name: 'rfqueryUpdateRf',
					vm: this,
					data: {
						id: id
					}
				}, (res) => {
					this.trueOrfalse = !res.data.flag;
				}, (error) => {});
			},

			starPeople() {			//查询柱状图人群
				//rType 时间
				//fType 次数
				//xType 成交金额
				//yType 客单价
				this.loading = true;
				this.charLoading = true;
				http({
					api_name: 'crmCrowdSign',
					vm: this,
					data: {
						type: 1
					}
				}, (res) => {
					this.loading = false;
					let data = [];
					let arr = res.data ? (res.data.signList ? res.data.signList : []) : [];
					let dateArr = [];
					arr.forEach(item => {
						if(item.modified) {
							dateArr.push(Date.parse(item.modified));
						} else {
							dateArr.push(Date.parse(item.created));
						}
					});
					this.time = dateArr.length ? dateFormat(Math.max.apply(null, dateArr), 'YY-MM-DD HH:MM:SS') : '';
					let successLen = 0;
					arr.forEach((items,index) => {
						// data.push(items.customerCount);
						this.queryGroupNumber(items.dealSet, (count) => {
							successLen++;
							data[index] = count;
							if(successLen == arr.length){
								console.log(data, JSON.stringify(data));
								this.initCharts(data);
								this.charLoading = false;
							}
						});
						this.vipLists[index].name = items.crowdName;
						this.vipLists[index].modelId = items.modelId;
						this.vipLists[index].id = items.id;
						this.vipLists[index].dealSet = typeof(items.dealSet) == 'string' ? JSON.parse(items.dealSet) : items.dealSet;
						let detail = typeof(items.dealSet) == 'string' ? JSON.parse(items.dealSet) : items.dealSet;
						this.vipLists[index].dealSet.fType = detail.fType ? detail.fType.toString() : '0';
						this.vipLists[index].dealSet.maxLastTradeDate = detail.maxLastTradeDate ? detail.maxLastTradeDate : '';
						this.vipLists[index].dealSet.maxTradeCount = detail.maxTradeCount ? detail.maxTradeCount : '';
						this.vipLists[index].dealSet.minLastTradeDate = detail.minLastTradeDate ? detail.minLastTradeDate : '';
						this.vipLists[index].dealSet.minTradeCount = detail.minTradeCount ? detail.minTradeCount : '';
						this.vipLists[index].dealSet.rType = detail.rType ? detail.rType.toString() : '0';
					});
				}, (error) => {
					this.loading = false;
				});
			},
			queryGroupNumber(dealSet, cb){
				http({
					api_name: 'queryCrowdCount',
					data: {
						dealSet
					},
					vm: this,
				}, result => {
					cb && cb(result.data.count);
				});
			},
			changeThis(item, index) {		//柱状图改变
				if(index) {
					this.dialogVisible = true;
					this.changeChartDia = true;
					this.chooseItem = item;
					this.title = item.name;
					this.rowSelect = item.dealSet.rType ? item.dealSet.rType.toString() : '2';
					this.dealNum = item.dealSet.fType ? item.dealSet.fType.toString() : '2';
					this.numOne = item.dealSet.minLastTradeDate ? item.dealSet.minLastTradeDate : '';
					this.numTwo = item.dealSet.maxLastTradeDate ? item.dealSet.maxLastTradeDate : '';
					this.timeDay = item.dealSet.rType == 0 ? item.dealSet.maxLastTradeDate : item.dealSet.minLastTradeDate;
					this.dealOne = item.dealSet.minTradeCount ? item.dealSet.minTradeCount : '';
					this.dealTwo = item.dealSet.maxTradeCount ? item.dealSet.maxTradeCount : '';
					this.dealDay = item.dealSet.fType == 0 ? item.dealSet.maxTradeCount : item.dealSet.minTradeCount;
				}
			},
			changeChart() {		//修改柱状图
				let data = {};
				data.id = this.chooseItem.id;
				data.modelId = this.chooseItem.modelId;
				data.crowdName = this.chooseItem.name;
				let dealSet = {};
				dealSet.timeType = this.chooseItem.dealSet.timeType || 1;
				dealSet.rType = this.rowSelect ? this.rowSelect.toString() : 1;
				dealSet.fType = this.dealNum ? this.dealNum.toString() : 1;
				dealSet.minLastTradeDate = this.rowSelect == 1 ? this.numOne : this.timeDay;
				dealSet.maxLastTradeDate = this.rowSelect == 1 ? this.numTwo : this.timeDay;
				dealSet.minTradeCount = this.dealNum == 1 ? this.dealOne : this.dealDay;
				dealSet.maxTradeCount = this.dealNum == 1 ? this.dealTwo : this.dealDay;
				if(!dealSet.minLastTradeDate || !dealSet.maxLastTradeDate || !dealSet.minTradeCount || !dealSet.maxTradeCount) {
					this.$message.error('修改数据不能为空！');
					return
				}
				if(this.rowSelect == 1) {
					if(Number(this.numTwo) < Number(this.numOne)) {
						this.$message.error('右侧最后交易时间要大于左侧最后交易时间！');
						return
					}
				}
				if(this.dealNum == 1) {
					if(Number(this.dealTwo) < Number(this.dealOne)) {
						this.$message.error('右侧累计成交次数要大于左侧成交数！');
						return
					}
				}
				data.dealSet = JSON.stringify(dealSet);
				this.loadingPage = true;
				http({
					api_name: 'crmCrowdupdateZxt',
					vm: this,
					data: data
				}, (res) => {
					this.loadingPage = false;
					this.dialogVisible = false;
					this.starPeople();
				}, (error) => {this.loadingPage = false;});
			},
			initCharts(data) {
				const myChart = echarts.init(document.getElementById('charts'));
				let option = {
				    color: ['#fff'],
				    backgroundColor: '#fff',
				    grid: {
				        left: '3%',
				        right: '8%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            name: '生命周期',
				            type : 'category',
				            data : ['兴趣会员', '新会员', '活跃会员', '沉睡会员', '流失会员'],
				            axisTick: {
					            show: false
					        },
				            axisLabel: {
				                show: false,
				            }

				        }
				    ],
				    yAxis : [
				        {
				            name: '人数',
				            type : 'value',
				            axisLabel: {
				                show: false,
				            },
				            splitLine: {
				                show: false
				            },
				            axisTick: {
					            show: false
					        }
				        }
				    ],
				    series : [
				        {
				            legendHoverLink: false,
				            type:'bar',
				            barWidth: '60%',
				            data: data,
				            itemStyle: {
				                borderWidth: 1,
				                borderColor: '#3A9AF6',
				                shadowBlur: 0,
								shadowColor: '#3A9AF6',
								color: '#3A9AF6'
				            },
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
									color: '#333',
									formatter(p){
										return (parseFloat(p.data).toFixed('') + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
									}
				                }
				            },
				        }
				    ]
				};
			 	myChart.setOption(option);
			},
			changeClick(item, index, arr) {
				this.borderChange();
				item.choose = true;
				this.colClick = arr == 'rowArr' ? true : false;
				this.rowClick = arr == 'colArr' ? true : false;
				setTimeout(() => {
					this.tableLiBorderChange(arr,index);
				}, 10);
				this.changeChartDia = false;
				this.dialogVisible = true;
				this.changeR = arr == 'rowArr' ? true : false;
				this.title = '修改RF模型';
				this.rSelect = item.types ? item.types.toString() : '0';
				this.rOne = item.lefts;
				this.rTwo = item.rights;
				this.rDay = item.types == 2 ? item.lefts : item.rights;
				this.rfItem = item;
				this.rfItem.index = index;
				this.rfItem.type = arr;
			},
			borderChange() {
				this.rowArr.forEach(item => {
					item.choose = false;
				});
				this.colArr.forEach(item => {
					item.choose = false;
				});
			},
			blurInp(item) {		//失焦事件
				if(this[item]) {
					if(isNaN(Number(this[item])) || /\./.test(this[item]) || /\+/.test(this[item])) {
						this.$message.error('只能输入正整数！');
						this[item] = '';
						return
					}
					if(Number(this[item] < 0)) {
						this.$message.error('只能输入正整数！');
						this[item] = '';
						return
					}
				}
			},
			cancel(flag) {		//取消修改rf表格
				this.rowClick = false;
				this.colClick = false;
				this.borderChange();
				this.tableLiBorderChange('colArr', -1);
				this.tableLiBorderChange('rowArr', -1);
				if(flag) {
					this.dialogVisible = false;
					return
				}
				this.showIcon = false;
				this.reList();
			},
			tableLiBorderChange(arr,index) {		//表格颜色改变事件
				let allArr = document.getElementsByClassName('dataLi');
					if(arr == 'colArr') {
						if(index >= 0) {
							this.$refs.redborder.style.top = ((index + 1) * 41) + 'px';
							this.$refs.redborder.style.left = '25px';
						}

						for(let i = 0; i < allArr.length; i++) {
							allArr[i].style.borderRight = '1px solid #d7d7d7';
							allArr[i].style.borderColor = '#d7d7d7';
							if(i < ((index + 1) * 6) && (i >= index * 6) && (index >= 0)) {
								allArr[i].style.borderRight = '1px solid red';
							}
						}
					} else {
						if(index >= 0) {
							this.$refs.blueborder.style.left = ((index + 1) * 111) + 25 + 'px';
							this.$refs.blueborder.style.top = '0px';
						}
						for(let i = 0; i < allArr.length; i++) {
							allArr[i].style.borderTop = '1px solid #d7d7d7';
							allArr[i].style.borderColor = '#d7d7d7';
							if(((i == index) || i == (6 + index) || i == (12 + index) || i == (18 + index) || i == (24 + index) || i == (30 + index)) && (index >= 0)) {
								allArr[i].style.borderTop = '1px solid #3A9AF6';
							}
						}
					}
			},
			reList() {		//查询rf表格
				this.loading = true;
				http({
					api_name: 'rfList',
					vm: this,
					data: {}
				}, (res) => {
					res.data = res.data.crmRf;

					this.rfTime = res.data.modified;
					this.rfqueryUpdateRf(res.data.id);
					res.data.dealSet = (typeof(res.data.dealSet) == 'string') ? JSON.parse(res.data.dealSet) : res.data.dealSet;
					this.loading = false;

					this.rowArr.forEach((item,index) => {
						if(index > 4) return
						item.types = res.data.dealSet[index].rType;
						item.lefts = res.data.dealSet[index].minLastTradeDate;
						item.rights = res.data.dealSet[index].maxLastTradeDate;
						item.name = res.data.dealSet[index].rType == 0 ? ('R≤' + res.data.dealSet[index].maxLastTradeDate) : ((res.data.dealSet[index].rType == 1) ? (res.data.dealSet[index].minLastTradeDate + '≤R≤' + res.data.dealSet[index].maxLastTradeDate) : ((res.data.dealSet[index].rType == 3) ? ('R=' + res.data.dealSet[index].minLastTradeDate) : ('R≥' + res.data.dealSet[index].minLastTradeDate)));
					});

					this.colArr.forEach((item,index) => {
						if(index > 4) return
						item.types = res.data.dealSet[index * 6].fType;
						item.lefts = res.data.dealSet[index * 6].minTradeCount;
						item.rights = res.data.dealSet[index * 6].maxTradeCount;
						item.name = res.data.dealSet[index * 6].fType == 0 ? ('F≤' + res.data.dealSet[index * 6].maxTradeCount) : ((res.data.dealSet[index * 6].fType == 1) ? (res.data.dealSet[index * 6].minTradeCount + '≤F≤' + res.data.dealSet[index * 6].maxTradeCount) : ((res.data.dealSet[index * 6].fType == 3) ? ('F=' + res.data.dealSet[index * 6].minTradeCount) : ('F≥' + res.data.dealSet[index * 6].minTradeCount)));
					});

					this.rfId = res.data.id;
					this.tableData = [];
					this.tableData.push(res.data.rf11);
					this.tableData.push(res.data.rf12);
					this.tableData.push(res.data.rf13);
					this.tableData.push(res.data.rf14);
					this.tableData.push(res.data.rf15);
					this.tableData.push(res.data.rf1z);
					this.tableData.push(res.data.rf21);
					this.tableData.push(res.data.rf22);
					this.tableData.push(res.data.rf23);
					this.tableData.push(res.data.rf24);
					this.tableData.push(res.data.rf25);
					this.tableData.push(res.data.rf2z);
					this.tableData.push(res.data.rf31);
					this.tableData.push(res.data.rf32);
					this.tableData.push(res.data.rf33);
					this.tableData.push(res.data.rf34);
					this.tableData.push(res.data.rf35);
					this.tableData.push(res.data.rf3z);
					this.tableData.push(res.data.rf41);
					this.tableData.push(res.data.rf42);
					this.tableData.push(res.data.rf43);
					this.tableData.push(res.data.rf44);
					this.tableData.push(res.data.rf45);
					this.tableData.push(res.data.rf4z);
					this.tableData.push(res.data.rf51);
					this.tableData.push(res.data.rf52);
					this.tableData.push(res.data.rf53);
					this.tableData.push(res.data.rf54);
					this.tableData.push(res.data.rf55);
					this.tableData.push(res.data.rf5z);
					this.tableData.push(res.data.rfz1);
					this.tableData.push(res.data.rfz2);
					this.tableData.push(res.data.rfz3);
					this.tableData.push(res.data.rfz4);
					this.tableData.push(res.data.rfz5);
					this.tableData.push(res.data.rfzz);
				}, (error) => {this.loading = false;});
			},
			goUerLink(item, index){
				/**
				 * rType、fType: 0 小于等于   1 介于  2 大于等于  3等于
				 * rType： 时间
				 * fType： 次数
				 * maxLastTradeDate: 最大天数
				 * minLastTradeDate: 最小天数
				 * maxTradeCount: 最大次数
				 * minTradeCount: 最小次数
				*/
				let name = index == 0 ? 2 : 1
				this.$router.push({
					path: '/vipList',
					query: {
						name,
						dealOne: item.dealSet.minTradeCount,
						dealTwo: item.dealSet.maxTradeCount,
						dateOne: item.dealSet.minLastTradeDate,
						dateTwo: item.dealSet.maxLastTradeDate,
						dateType: item.dealSet.rType,
						dealType: item.dealSet.fType
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.m-content-main{
	font-size: 14px;
	padding: 17px 25px 30px 15px;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	.header{
		.time{
			color: rgb(103,103,99);
		}
	}
	.lifeCycle{
		height: 350px;
		width: 850px;
		padding-bottom: 60px;
		position: relative;
		.charts{
			height: 350px;
		}
		.charts_link{
			position: absolute;
			width: 700px;
			height: 280px;
			top: 60px;
			left: 55px;
			.charts_link_item{
				position: absolute;
				height: 280px;
				width: 95px;
				top: 0;
				cursor: pointer;
				&:nth-child(1){
					left: 0;
				}
				&:nth-child(2){
					left: 150px;
				}
				&:nth-child(3){
					left: 300px;
				}
				&:nth-child(4){
					left: 455px;
				}
				&:nth-child(5){
					left: 605px;
				}
			}
		}
		.charLoading{
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			right: 0;
			bottom: 30px;
			background: rgba(0,0,0,0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 20px;
		}
	}
	.vipAnalysis{
		padding: 0 66px 0 25px;
		li{
			width: 20%;
			text-align: center;
		}
	}
	.lineDiv{
		position: absolute;
		background: #edf2f8;
		width: 100%;
		top: 420px;
		height: 20px;
		left: 0;
	}
}
.m-content{
	//background: #edf2f8 !important;
	.row_line{
		.row_span{
			display: inline-block;
			width: 114px;
		}
		.dealWidth{
			width: 90px;
		}
		.inpWidth{
			width: 60px;
		}
	}
	.errorMess{
		height: 40px;
	}
	.clickBut{
		button{
			width: 80px;
		}
	}
	.rfTable{
		position: relative;
		overflow: hidden;
		.headerTab .head{
			background: #f0f0f0;
		}
		.tableborder{
			position: absolute;
			z-index: 2;
		}
		.redborder{
			border: 1px solid red;
			width: 776px;
			height: 40px;
			top: 0;
			left: 25px;
		}
		.blueborder{
			border: 1px solid #3A9AF6;
			width: 110px;
			height: 286px;
			top: 0;
			left: 25px;
			box-shadow:0px 10px 15px 0px rgba(201,228,255,0.5);
		}
		.everyUl{
			z-index: 9;
			padding-left: 25px;
		}
		.row_li{
			width: 110px;
			height: 40px;
			border: 1px solid rgb(215,215,215);
			border-bottom: none;
			border-left: none;
			position: relative;
			overflow: hidden;
			list-style: none;
			.leftHead{
				display: block;
				height: 20px;
				line-height: 20px;
				width: 100%;
				font-size: 12px;
			}
			.solid{
				top: 0;
				position: absolute;
				width: 150px;
				height: 1px;
				background: #333;
				transform-origin: left top;
			    transform: rotate(19.6deg);
			    -webkit-transform: rotate(19.6deg);
			    -moz-transform: rotate(19.6deg);
			    -ms-transform: rotate(19.6deg);
			    -o-transform: rotate(19.6deg);
			}
		}
		.borderL{
			border-left: 1px solid rgb(215,215,215);
		}
		.borderB{
			border-bottom: 1px solid rgb(215,215,215);
		}
		.head{
			line-height: 40px;
		}
		.liChoose{
			border-color: red;
		}
		.rightBor{
			border-right: 1px solid red;
		}
		.rightTable{
			width: 700px;
		}
	}
	.rfchange{
		.clickBut{
			margin-top: 60px;
		}
	}
}

</style>
