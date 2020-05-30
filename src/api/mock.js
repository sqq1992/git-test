import MockMap from './mock_fe'
const apiMap = {

	getPhotos: '/ware/list', // 查询商品列表
	// 公共模块
	memberquery: '/member/query', // 店铺详情查询
	queryVisitInfoStatistics: '/common/queryVisitInfoStatistics', // 获取访问统计信息
	getPublishPageInfo: '/common/getPublishPageInfo', // 发布会员中心查询
	changePublishStatus: '/common/changePublishStatus', // 修改发布状态
	querySkuByWareId: '/activity/querySkuByWareId', // 根据商品ID获取SKU列表
	queryProductWrapById: '/activity/queryProductWrapById', //根据商品ID获取SKU列表-自营店铺
	activityQueryWare: '/activity/queryWare', // 获取商品列表
	queryProductWrap: '/activity/queryProductWrap', // 获取商品列表-自营店铺


	// 页面管理
	memberCenterQuery: '/memberCenter/query',// 查询会员中心内容
	memberCenterCouponList: '/memberCenter/couponList',// 查询优惠券
	memberCardList: '/collarCardGift/list',    // 开卡礼包列表
	memberCreateCard: '/collarCardGift/create', // 开卡
	queryBalance: '/collarCardGift/queryAccountBalance', // 查询余额
	queryCardDetail: '/collarCardGift/findRuleById', // 查询奖项设置
	memberCenterEdit: '/memberCenter/edit',// 编辑会员中心内容
	shopStoryQuery: '/shopStory/queryById', // 查询店铺故事
	shopStoryEdit: '/shopStory/save', // 修改店铺故事
	getShopList: '/shopStory/queryList', // 查询品牌故事千人千面列表
	delShopListItem: '/shopStory/removeUndefaulted', // 删除品牌故事
	queryCrowds: '/shopStory/queryCrowds', // 人群查询
	getVipCardList: '/memberPrivilege/query', // 会员卡列表查询
	saveVipCardData: '/memberPrivilege/edit', // 保存会员激活积分
	changeVipCardShelves: '/memberPrivilege/edit', // 更改会员卡上下架状态
	getVipTagList: '/memberPrivilege/query', // 会员头像列表查询
	saveVipTagData: '/memberPrivilege/edit', // 保存会员头像激活积分
	changeVipTagShelves: '/memberPrivilege/edit', // 更改会员头像上下架状态
	queryVipLookRecord: '/unlock/list', // 查询解锁记录
	unlockTypeList: '/unlock/type/list', // 解锁记录 -- 查询店铺会员卡和头像徽章列表
	getCrmGroupList: '/crmGroup/list', // 查询人群分组
	queryMemberCentersConfig: '/memberCenter/queryConfig', // 查询图标配置
	saveMemberCentersConfig: '/memberCenter/saveConfig', // 保存图标配置
	saveGiftOrderList: '/gift/reOrderGift', // 礼品列表重排序
	saveActivityOrderList: '/activity/reOrderActivity', // 活动重排序

	//专享券模块
	couponEdit: '/coupon/edit',		//编辑专享券
	couponAdd: '/coupon/add',		//新建专享券
	couponList: '/coupon/list',		//查询专享券
	couponQuery: '/coupon/query',	//查询专享券详情
	couponStatus: '/coupon/status',	//优惠券状态列表
	couponStartNow: '/coupon/startNow',	//接口名称 立即开始活动
	couponEndNow: '/coupon/endNow',	//接口名称 立即结束活动
	couponNameCheck: '/coupon/name/check',	//接口名称 检查活动名称是否可用
	getCouponDetail: '/coupon/getDetailByCouponId', // 查询优惠券详情
	addMembershipDiscountRule: '/activity/addMembershipDiscountRule',//保存会员专享价
	getMembershipDiscountRuleById: '/activity/getMembershipDiscountRuleById',//获取会员专享价详情
	memberShipDiscountRecord: '/activity/memberShipDiscountRecord',//会员专享价参与记录
	getValidAndSortedDiscountActivities: '/activity/getValidAndSortedDiscountActivities', //会员专享价-排序活动列表
	getMembershipDiscountRule: '/activity/getMembershipDiscountRule', //会员专享价-活动列表
	sortedDiscountActivities: '/activity/sortedDiscountActivities',// 会员活动排序
	setMembershipDiscountConfig: '/activity/setMembershipDiscountConfig',// 会员专享价-活动页面展示
	getMembershipDiscountConfig: '/activity/getMembershipDiscountConfig',//会员专享价-活动页面展示设置查询
	appendMembershipDiscountPins: '/activity/appendMembershipDiscountPins',//会员专享价-追加会员



	//忠诚度管理
	memberScoreList: '/member/score/list',		//会员积分列表
	memberScoreDetail: '/member/score/detail',		//接口名称 会员积分明细
	memberScoreRules: '/member/score/rules',		//接口名称 会员积分规则列表
	memberLevelList: '/member/level/list',		//接口名称 会员等级规则列表
	memberLevelNameCheck: '/member/level/name/check',		//检查新名称
	memberLevelName: '/member/level/name',		//设置等级名称
  memberLevelDiscount: '/member/level/discount', // 设置会员等级的折扣
  brandCustomerList:'/brandCustomer/list',//品牌会员列表/历史会员列表


	//奖励积分规则
	membermodify: '/member/score/reward/rules/modify',	//修改积分奖励规则列表
	memberdelete: '/member/score/reward/rules/delete',	//删除积分奖励规则列表
	memberadd: '/member/score/reward/rules/add',	//新建积分奖励规则列表
	memberLook: '/member/score/reward/rules',	//查询积分奖励规则列表


	//会员管理
	memberList: '/member/list',						//会员列表
	crmCrowdDelete: '/crmCrowd/delete',				//人群删除
	crmCrowdEdit: '/crmCrowd/insertOrUpdate',				//人群新增/修改
	crmGroupList: '/crmGroup/list',				//分组列表
	crmGroupDelete: '/crmGroup/delete',				//分组删除
	crmGroupEdit: '/crmGroup/insertOrUpdate',				//分组新增/编辑
	crmCrowdList: '/crmCrowd/list',				//查询人群列表
	crmCrowdSign: '/crmCrowd/sign',				//查询星标人群/查询柱形图列表
	crmCrowdSetSign: '/crmCrowd/setSign',				//设置标星
	queryCrowdCount: '/crmCrowd/crowdCount',   // 查询人群数量
	queryCrowdById:'/crmCrowd/getById', //通过id查询人群
	deleteBlackList: '/crmcustomerblacklist/delete',

	//会员营销
	marketingGetMobileNum: '/marketing/getMobileNumByRule',//会员营销-查询有手机号的会员数
  marketingSendMsgDetail: '/marketing/sendMsgDetail',//会员营销-短信发送日志
  getMarketingAnalyzeData:'/marketing/getMarketingAnalyzeData',//效果分析
  marketingBuyerInfo:'/marketing/marketingBuyerInfo',//客户明细
  marketingGoods:'/marketing/marketingGoods',//商品明细
	marketingCreate: '/marketing/create',//会员营销-营销活动创建
	mobileCreate: '/jdMarketing/sendManualMsg', // 指定号码营销-营销活动创建
	marketingRemove: '/marketing/remove',//会员营销-营销活动删除
	marketingCancel: '/marketing/cancel',//会员营销-营销活动取消发送
	marketingGetMarketingList: '/marketing/getMarketingList',//会员营销-营销活动-活动列表
	marketingSendImmediately: '/marketing/sendImmediately',//会员营销-营销活动-立即发送
	marketingGetDetail: '/marketing/getMarketingDetail',//会员营销-获取活动详情
	mobileGetDetail: '/jdMarketing/exportManualSendLog', //指定营销活动-获取活动详情
	marketingGetMobile: '/marketing/getMobileByTemplate',//会员营销-指定号码营销-批量导入手机号
	marketingGetSignList:'/marketing/getSignList',//短信签名-查询
	marketingAddSign:'/marketing/addSign',//短信签名-新增
	marketingDeleteSign:'/marketing/deleteSign',//短信签名-删除
  marketingValidSms: '/marketing/validBlacklist',//短信验证违禁词
  getSmsEffect:'/jdMarketing/getSmsEffect', //自营店营销效果分心
  checkDataState:'/jdMarketing/checkDataState',//商家热点同步状态
  customerBlacklist: '/crmcustomerblacklist/list',   // 黑名单
  addCustomerBlacklist: '/crmcustomerblacklist/batchAdd',   // 添加黑名单
	importCustomerBlacklist: '/crmcustomerblacklist/import',   // 导入方式 添加黑名单
	addBlackListPin:  '/crmcustomerblacklist/add',//添加黑名单/成交会员

  //自动短信
  getMarketingSettingInitData:'/logisticsMarketing/getMarketingSettingInitData',//自动短信查询
  saveMarketingSetting:'/logisticsMarketing/saveMarketingSetting',//保存自动短信
  closeMarketingSetting:'/logisticsMarketing/closeMarketingSetting',//关闭自动短信

	//二期-忠诚度
	memberSetPoints: '/member/setPoints',					//单笔订单最大积分奖励上限
	rfUpdate: '/rf/update',					//修改rf模型数据
	memberchangePoints: '/member/score/changePoints',					//变更积分
	rfList: '/rf/list',					//查询rf模型方格列表数据
	crmCrowdjudgeCrowd: '/crmCrowd/judgeCrowd',					//查询会员所属人群
	rfqueryUpdateRf: '/rf/queryUpdateRf',					//查询会员所属人群
  crmCrowdupdateZxt: '/crmCrowd/updateZxt',					//修改柱形图
  sendMsgDetail:'/marketing/sendMsgDetail',//验证码发送详情

	//积分互动
	signActivityList: '/activity/activityList', //活动列表
	searchExtemalRecode: '/points/searchExtemalRecode',//积分导入记录查询
	excelUpload: '/points/excelUpload',
	deleteActivity: '/activity/remove', //活动列表-下架
	getLottoRuleById: '/activity/getlotteryRuleById', //大转盘-获取信息
	addLottoRule: '/activity/addLottoRule', //大转盘-创建
	getSignRuleById: '/activity/getSignRuleById', //每日签到-获取信息
	onOrOff: '/activity/onOrOff',//上架下架活动
	addSignRule: '/activity/addSignRule', //保存签到
	addLotteryRule: '/activity/addLotteryRule', //保存抽奖
  activityRecord: '/activity/activityRecord', //活动参与记录
  downloadActivityRecord: '/activity/downloadActivityRecord',//导出活动参与记录
	awardRecord: '/activity/awardRecord', //活动奖品记录
	activityAnalyze: '/activity/activityAnalyze', //活动分析
	customerStats: '/activity/customerStats', //活动分析
	addMemberCompleteRule: '/activity/addMemberCompleteRule',//完善会员信息
  getMemberRuleById: '/activity/getMemberRuleById',//获取完善会员信息
  newcomerActivity:'/newcomerActivity/createOrUpdate',//新人入会礼
  getActivity:'/newcomerActivity/getActivity',//新人入会查询
  checkIfExists:'/newcomerActivity/checkIfExists',//检测是否已有新人入会礼活动
  switchCollarCardMode:'/collarCard/switchCollarCardMode',//开卡状态切换
  sendVerifySms:'/collarCard/sendVerifySms',//获取短信验证码
  saveWareFollow:'/wareActivity/saveWareFollow',//保存收藏加购
  getWareFollow:'/wareActivity/getWareFollow',//获取收藏加购活动信息
  saveInvitationWareFollow: '/wareActivity/saveInvitationWareFollow',//邀请收藏加购保存
  getInvitationWareFollow:'/wareActivity/getInvitationWareFollow',//邀请收藏详情
	//积分商城
	giftList: '/gift/giftList', //礼品列表
	giveList: '/gift/giveList', //礼品兑换列表
	giveGiftInfo: '/gift/giveGiftInfo', //发放列表详情
	giftById: '/gift/giftById', //礼品详情
	jdSaveGift: '/jdCoupon/save', //礼品详情
  systemTime: '/common/systemTime', //系统时间
  saveGift: '/gift/save', //礼品详情
	giveGift: '/gift/giveGift', //礼品详情
	giftOnOff: '/gift/onOrOff.json',//礼品上下架
	removeGift: '/gift/remove.json',//礼品上下架
	queryOnline: 'coupon/queryOnline',//上架优惠券
	exportGiftList: '/gift/exportCommodityGiftList', // 导出实物兑换记录
	importGiftList: '/gift/importCommodityGiftList', // 导入实物兑换记录
	getGiftOrderDetail: '/gift/orderDetail', // 获取积分礼品订单详情

	//关注店铺
	addFollowShopRule : '/activity/addFollowShopRule', // 保存关注店铺活动
	getFollowShopRuleById : '/activity/getFollowShopRuleById', // 获取关注店铺活动
	createUnitPromotionWrite: '/activity/createUnitPromotionWrite', //创建商品折扣
	activityOrderRecord: '/activity/activityOrderRecord',//订单统计
	getBasicShop: '/activity/getBasicShop',//邀请-基本信息
	getInvitationPeopleRuleById: '/activity/getInvitationPeopleRuleById',//邀请-编辑
	addInvitationPeopleRule: '/activity/addInvitationPeopleRule',//邀请-新建
	approveUnitPromotionWrite: '/activity/approveUnitPromotionWrite',//促销审核

  //h5小游戏
  addLittleGameRule:'/activity/addLittleGameRule',//新建小游戏
  getLittleGameRuleById:'/activity/getLittleGameRuleById',//获取小游戏配置
	//会员福利社
	addBargainRule: '/activity/addBargainRule',//砍价
	addCollageRule: '/activity/addCollageRule',//砍价
	getCollageRuleById: '/activity/getCollageRuleById',//拼团编辑
  getBargainRuleById: '/activity/getBargainRuleById',//砍价编辑

	mobileGet: '/member/mobile/get.json',//会员列表查看手机号

	// 数据统计
	todayData: '/activityStatistics/dailyDataSummary', // 每日数据汇总
	exchangeStatistics: '/activityStatistics/exchangeStatistics', // 兑换统计
	pointStatistics: '/activityStatistics/pointStatistics', // 积分统计
  interactStatistics: '/activityStatistics/interactStatistics', // 互动统计
  dynamicTotalStatistics:'/activityStatistics/dynamicTotalStatistics',//汇总查询


	//智能营销
	getRechargeList: '//crmad.superboss.cc/activity/getInitData',//获取充值列表
  getSmsPackagePrice: '//crmad.superboss.cc/activity/getSmsPackagePrice',//自定义充值
  getYhMsg:'//crmad.superboss.cc/activity/getYhMsg ',//专属优惠包
	getAgreement: '/recharge/agreement/get',//获取协议同意状态
	setAgreement: '/recharge/agreement/update',//设置协议同意状态
	// getFirstRechargeList: '/mock/getFirstRechargeList',//首充列表
	getChargeRecordList: '/recharge/getSmsRecords',//充值记录
	getSmsUseRocordList: '/recharge/getUseRecords',//使用记录
  // getMarketingDateEvents: '/mock/getMarketingDateEvents',//营销日历事件
  getSendRecord: '/getSendRecord',//发送记录


  // 京东店铺智能营销
  jdMarketing_getSigns:'/jdMarketing/getSigns',//京东签名
  jdMarketing_addSign:'/jdMarketing/addSign',//新增京东签名
  jdMarketing_modifySign:'/jdMarketing/modifySign',//修改京东签名
  jdMarketing_predict: '/jdMarketing/compute', // 人群预测
  jdMarketing_create: '/jdMarketing/create', // 创建营销
  jdMarketing_test:'/jdMarketing/sendTest',//测试发送
  jdMarketing_list:'/jdMarketing/list',//发送列表
  jdMarketing_getSmsEffect:'/jdMarketing/getSmsEffect',//效果分析
  stopMsgboxActivity:'/jdMarketing/stopMsgboxActivity',//取消发送
  jdMarketing_detail:'/jdMarketing/detail',//活动详情
  jdMarketing_shortUrl:'/jdMarketing/generateShortURL',//京东短连
  smsRecordListByDate:'/jdMarketing/smsRecordListByDate',//使用记录
  smsRecordList:'/jdMarketing/smsRecordList',//返还记录

  //模板
  getSysTemplate:'/logisticsMarketing/getSysTemplate',//获取短信模板

}


module.exports = (function() {
  if(process.env.NODE_ENV === 'development') {
    // 兼容老的
    Object.keys(apiMap).reduce((j,key) => {
      j[key] = MockMap[key] || '/mock/'+key
      return j
    },{})
  }else {
    return apiMap
  }
})()
