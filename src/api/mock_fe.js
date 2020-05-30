
// 请不要在添加mock数据 保留是为了兼容老的mock数据
module.exports = {

	getPhotos: '/mock/getPhotos', // 查询商品列表
	// 公共模块
	memberquery: '/mock/memberquery', // 店铺详情查询
	commonQueryWare: '/mock/commonQueryWare', // 获取商品列表
	queryVisitInfoStatistics: '/mock/commonQueryVisitInfoStatistics', // 获取访问统计信息
	getPublishPageInfo: '/mock/commonGetPublishPageInfo', // 发布会员中心查询
	changePublishStatus: '/mock/commonChangePublishStatus', // 修改发布状态
	querySkuByWareId: '/mock/querySkuByWareId', // 根据商品ID获取SKU列表
	activityQueryWare: '/mock/activityQueryWare', // 获取商品列表

	// 页面管理
	memberCenterQuery: '/mock/memberCenterQuery',// 查询会员中心内容
	memberCenterCouponList: '/mock/memberCenterCouponList',// 查询优惠券
	memberCenterEdit: '/mock/memberCenterEdit',// 编辑会员中心内容
	shopStoryQuery: '/mock/shopStoryQuery',// 查询品牌故事
	shopStoryEdit: '/mock/shopStoryEdit', // 修改品牌故事
	getShopList: '/mock/getShopList', // 查询品牌故事千人千面列表
	delShopListItem: '/mock/delShopListItem', // 删除品牌故事
	queryCrowds: '/mock/queryCrowds', // 人群查询
	getVipCardList: '/mock/getVipCardList', // 会员卡列表查询
	saveVipCardData: '/mock/saveVipCardData', // 保存会员激活积分
	changeVipCardShelves: '/mock/changeVipCardShelves', // 更改会员卡上下架状态
	getVipTagList: '/mock/getVipTagList', // 会员头像列表查询
	saveVipTagData: '/mock/saveVipTagData', // 保存会员头像激活积分
	changeVipTagShelves: '/mock/changeVipTagShelves', // 更改会员头像上下架状态
	queryVipLookRecord: '/mock/queryVipLookRecord', // 查询解锁记录
	unlockTypeList: '/mock/unlockTypeList', // 解锁记录 -- 查询店铺会员卡和头像徽章列表
	getCrmGroupList: '/mock/getCrmGroupList', // 查询人群分组
	queryMemberCentersConfig: '/mock/queryMemberCentersConfig', // 查询图标配置
	saveMemberCentersConfig: '/mock/saveMemberCentersConfig', // 保存图标配置
	saveGiftOrderList: '/mock/saveGiftOrderList', // 礼品列表重排序
	saveActivityOrderList: '/mock/saveActivityOrderList', // 活动重排序

	//专享券模块
	couponEdit: '/mock/couponEdit',		//编辑专享券
	couponAdd: '/mock/couponAdd',		//新建专享券
	couponList: '/mock/couponList',		//查询专享券
	cardList: '/mock/collarCardGift/list',    // 开卡礼包列表
	couponQuery: '/mock/couponQuery',	//查询专享券详情
	couponStatus: '/mock/couponStatus',	//优惠券状态列表
	couponStartNow: '/mock/couponStartNow',	//接口名称 立即开始活动
	couponEndNow: '/mock/couponEndNow',	//接口名称 立即结束活动
	couponNameCheck: '/mock/couponNameCheck',	//接口名称 检查活动名称是否可用
	getCouponDetail: '/mock/getCouponDetail', // 查询优惠券详情

	//忠诚度管理
	memberScoreList: '/mock/memberScoreList',		//会员积分列表
	memberScoreDetail: '/mock/memberScoreDetail',		//接口名称 会员积分明细
	memberScoreRules: '/mock/memberScoreRules',		//接口名称 会员积分规则列表
	memberLevelList: '/mock/memberLevelList',		//接口名称 会员等级规则列表
	memberLevelNameCheck: '/mock/memberLevelNameCheck',		//检查新名称
	memberLevelName: '/mock/memberLevelName',		//设置等级名称
	memberLevelDiscount: '/mock/memberLevelDiscount', // 设置会员等级的折扣


	//奖励积分规则
	membermodify: '/mock/membermodify',	//修改积分奖励规则列表
	memberdelete: '/mock/memberdelete',	//删除积分奖励规则列表
	memberadd: '/mock/memberadd',	//新建积分奖励规则列表
	memberLook: '/mock/memberLook',	//查询积分奖励规则列表

	//会员管理
	memberList: '/mock/memberList',						//会员列表
	crmCrowdDelete: '/mock/crmCrowdDelete',				//人群删除
	crmCrowdEdit: '/mock/crmCrowdEdit',				//人群新增/修改
	crmGroupList: '/mock/crmGroupList',				//分组列表
	crmGroupDelete: '/mock/crmGroupDelete',				//分组删除
	crmGroupEdit: '/mock/crmGroupEdit',				//分组新增/编辑
	crmCrowdList: '/mock/crmCrowdList',				//查询人群列表
	crmCrowdSign: '/mock/crmCrowdSign',				//查询星标人群/查询柱形图列表
	crmCrowdSetSign: '/mock/crmCrowdSetSign',				//设置标星
	queryCrowdCount: '/mock/queryCrowdCount',   // 查询人群数量


  customerBlacklist:    '/mock/customerBlacklist',   // 黑名单
  addCustomerBlacklist: '/mock/addCustomerBlacklist',   // 添加黑名单




	//二期-忠诚度
	memberSetPoints: '/mock/memberSetPoints',					//单笔订单最大积分奖励上限
	rfUpdate: '/mock/rfUpdate',					//修改rf模型数据
	memberchangePoints: '/mock/memberchangePoints',					//变更积分
	rfList: '/mock/rfList',					//查询rf模型方格列表数据
	crmCrowdjudgeCrowd: '/mock/crmCrowdjudgeCrowd',					//查询会员所属人群
	rfqueryUpdateRf: '/mock/rfqueryUpdateRf',					//查询会员所属人群
	crmCrowdupdateZxt: '/mock/crmCrowdupdateZxt',					//修改柱形图

	//积分互动
	signActivityList: '/mock/signActivityList', //活动列表
	getLottoRuleById: '/mock/getLottoRuleById', //大转盘-获取信息
	addLottoRule: '/mock/addLottoRule', //大转盘-创建
	getSignRuleById: '/mock/getSignRuleById', //每日签到-获取信息
	onOrOff: '/mock/onOrOff',//上架下架活动
	deleteActivity: '/mock/deleteActivity', //活动列表-删除
	addSignRule: '/mock/onOrOff', //创建签到
	addLotteryRule: '/mock/onOrOff', //创建大转盘
	activityRecord: '/mock/activityRecord', //活动参与记录
	awardRecord: '/mock/awardRecord', //活动奖品记录
	activityAnalyze: '/mock/activityAnalyze', //活动分析
	customerStats: '/mock/customerStats', //活动分析

	//积分商城
	giftList: '/mock/giftList', //积分商城-礼品列表
	giveList: '/mock/giveList', //礼品兑换列表
	giveGiftInfo: '/mock/giveGiftInfo', //发放列表详情
	giftById: '/mock/giftById', //礼品详情
	saveGift: '/mock/onOrOff', //新建/编辑礼品
	giveGift: '/mock/onOrOff', //实物礼品发放
	queryOnline: 'mock/queryOnline',//上架优惠券
	exportGiftList: '/mock/exportGiftList', // 导出实物兑换记录
	importGiftList: '/mock/importGiftList', // 导入实物兑换记录
	getGiftOrderDetail: '/mock/getGiftOrderDetail', // 获取积分礼品订单详情

	//关注店铺
	queryWare: '/mock/queryWare', // 获取商品列表
	addFollowShopRule : '/mock/onOrOff', // 保存关注店铺活动
	getFollowShopRuleById : '/mock/getFollowShopRuleById', // 获取关注店铺活动
	querySkuByWareId : '/mock/querySkuByWareId', // 根据商品ID获取SKU列表
	createUnitPromotionWrite: '/mock/onOrOff', //创建商品折扣
	activityOrderRecord: '/mock/customerStats',//订单统计
	getBasicShop: '/mock/getBasicShop',//邀请-基本信息
	getInvitationPeopleRuleById: '/mock/getInvitationPeopleRuleById',//邀请-编辑
	addInvitationPeopleRule: '/mock/onOrOff',//邀请-新建
	addMemberCompleteRule: '/mock/onOrOff',//完善会员信息
	getMemberRuleById: '/mock/getMemberRuleById',//获取完善会员信息
	approveUnitPromotionWrite: '/mock/onOrOff',//促销审核

	//会员福利社
	addBargainRule: '/mock/onOrOff',//砍价
	addCollageRule: '/mock/onOrOff',//拼团
	getCollageRuleById: '/mock/getInvitationPeopleRuleById',//拼团编辑
	getBargainRuleById: '/mock/getInvitationPeopleRuleById',//砍价编辑

	// 数据统计
	todayData: '/mock/activityStatisticsDailyDataSummary', // 每日数据汇总
	exchangeStatistics: '/mock/activityStatisticsExchangeStatistics', // 兑换统计
	pointStatistics: '/mock/activityStatisticsPointStatistics', // 积分统计
	interactStatistics: '/mock/activityStatisticsInteractStatistics', // 互动统计

	//智能营销
	getRechargeList: '/mock/getRechargeList',//获取充值列表
	getFirstRechargeList: '/mock/getFirstRechargeList',//首充列表
	getChargeRecordList: '/mock/getChargeRecordList',//充值记录
	getSmsUseRocordList: '/mock/getSmsUseRocordList',//使用记录
  getMarketingDateEvents: '/mock/getMarketingDateEvents',//营销日历事件
  getSendRecord: '/mock/getSendRecord',//发送记录
}
