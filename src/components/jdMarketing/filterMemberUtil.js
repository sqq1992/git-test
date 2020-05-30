/**
 * 首字母大写
 * @param {String} str
 * @return {String}
 */
export function capitalize(str){
  return str.replace( /(^|\s)([a-z])/g, function(m, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
/*
具体标签
一个标签对象有以下几部分组成：
{String} name 标签名
{String} key 标签key
{String} desc 标签定义
{Object | String | Boolean} component 对应的交互组件
1.component为Object时，代表抽象的标签公共交互组件。格式如下：
component: {
  name: 'xx', // 类型 common 通用组件(radio/select)/priceGroup 金额输入框组/countGroup 次数输入框组/dateTimeRange 时间间隔/dateRange 日期间隔/checkbox/skus
  options: {} // 配置项
}
2.component为'custom'时，代表不使用公共组件(需要自己在@/component/jdMarketing/filterMember/中编写对应的组件)
3.component为false时，代表不需要控件
默认为false
*/
export const tagMap = {
  // 店铺行为
  shopUserValue: {
    name: '店铺高价值用户',
    key: 'shopUserValue',
    desc: '根据近一年客户在京东的交易和行为数据进行综合评价',
    component: {
      name: false,
      options: {
        defaultValue: [4, 3],
        matchMode: 'terms'
      }
    },
    // 接口字段
    value: 'opdata_shop_user_value'
  },
  shopPayOrdAmount: {
    name: '完成订单金额',
    desc: '在店铺的累计完成订单金额',
    key: 'shopPayOrdAmount',
    value: 'opdata_shop_complete_ord_amount',
    component: {
      name: 'priceGroup',
      options: {
        suffix: '元',
        label: '金额',
        matchMode: 'range'
      }
    }
  },
  shopCompleteOrdNum: {
    name: '完成交易笔数',
    desc: '客户在店铺的完成订单量',
    key: 'shopCompleteOrdNum',
    value: 'opdata_shop_complete_ord_num',
    component: {
      name: 'countGroup',
      options: {
        label: '完成交易笔数',
        matchMode: 'range'
      }
    }
  },
  shopFirstTm: {
    name: '首次交易时间',
    desc: '客户首次购买商品的时间',
    key: 'shopFirstTm',
    value: 'opdata_shop_first_tm',
    component: {
      name: 'dateRange',
      options: {
        matchMode: 'range',
        disabledDateDiff: false
      }
    }
  },
  shopLastOrdTm: {
    name: '最近交易时间',
    desc: '在店铺最近一次付款的时间',
    key: 'shopLastOrdTm',
    value: 'opdata_shop_last_ord_tm',
    component: {
      name: 'dateTimeRange',
      options: {
        matchMode: 'range',
        disabledDateDiff: false
      }
    }
  },
  shopAtv: {
    name: '客单价',
    desc: '完成交易的客单价',
    key: 'shopAtv',
    value: 'opdata_shop_atv',
    component: {
      name: 'priceGroup',
      options: {
        matchMode: 'range',
        suffix: '元',
        label: '金额'
      }
    }
  },
  shopOrdIncompleteMemberFlag: {
    name: '下单未完成客户',
    desc: '在店铺有过下单且没有完成状态的订单',
    key: 'shopOrdIncompleteMemberFlag',
    component: {
      name: false,
      options: {
        defaultValue: {
          value: 1
        },
        matchMode: 'term'
      }
    },
    value: 'opdata_shop_ord_incomplete_member_flag'
  },
  shopLastCouponTm: {
    name: '最近领券时间',
    desc: '客户最近一次领取优惠券的时间',
    key: 'shopLastCouponTm',
    value: 'opdata_shop_last_coupon_tm',
    component: {
      name: 'dateRange',
      options: {
        matchMode: 'range',
        disabledDateDiff: false
      }
    }
  },
  shopLastCartTm: {
    name: '最近加购时间',
    desc: '客户最近一次加购商品的时间',
    key: 'shopLastCartTm',
    value: 'opdata_shop_last_cart_tm',
    component: {
      name: 'dateRange',
      options: {
        disabledDateDiff: false,
        matchMode: 'range'
      }
    }
  },
  shopLastVisitTm: {
    name: '最近浏览店铺时间',
    desc: '客户最近一次浏览店铺的时间',
    key: 'shopLastVisitTm',
    value: 'opdata_shop_last_visit_tm',
    component: {
      name: 'dateRange',
      options: {
        disabledDateDiff: false,
        matchMode: 'range'
      }
    }
  },
  shopLastEndInquiryTm: {
    name: '最近咚咚咨询时间',
    desc: '客户最近一次咚咚咨询的时间',
    key: 'shopLastEndInquiryTm',
    value: 'opdata_shop_last_end_inquiry_tm',
    component: {
      name: 'dateRange',
      options: {
        disabledDateDiff: false,
        matchMode: 'range'
      }
    }
  },
  shopLastLaunchTm: {
    name: '最近短信营销时间',
    desc: '客户最近一次被短信营销的时间',
    key: 'shopLastLaunchTm',
    value: 'opdata_shop_last_launch_tm',
    component: {
      name: 'dateRange',
      options: {
        disabledDateDiff: false,
        matchMode: 'range'
      }
    }
  },
  // 商品行为
  shopLast90DaysCartSkus: {
    name: '指定商品加购',
    desc: '近90天内加购某商品（最多30个）且当天未下单的人',
    key: 'shopLast90DaysCartSkus',
    value: 'opdata_shop_last90days_cart_skus',
    component: {
      name: 'skus',
      options: {
        matchMode: 'terms'
      }
    }
  },
  shopLast90DaysFollowSkus: {
    name: '指定商品关注',
    desc: '近90天内关注某商品（最多30个）的人',
    key: 'shopLast90DaysFollowSkus',
    value: 'opdata_shop_last90days_follow_skus',
    component: {
      name: 'skus',
      options: {
        matchMode: 'terms'
      }
    }
  },
  shopLast90DaysVisitSkus: {
    name: '指定商品浏览',
    desc: '近90天内访问某商品（最多30个）详情页的人',
    key: 'shopLast90DaysVisitSkus',
    value: 'opdata_shop_last90days_visit_skus',
    component: {
      name: 'skus',
      options: {
        matchMode: 'terms'
      }
    }
  },
  shopLast90DaysOrdCptSkus: {
    name: '指定商品购买',
    desc: '用户近90天内购买过某商品（最多30个）的人',
    key: 'shopLast90DaysOrdCptSkus',
    value: 'opdata_shop_last90days_ord_cpt_skus',
    component: {
      name: 'skus',
      options: {
        matchMode: 'terms'
      }
    }
  },
  // 客户偏好
  platformBigsalePrefer: {
    name: '大促偏好人群',
    desc: '大促购买力高于平时的客户群，根据订单占比进行偏好分级',
    key: 'platformBigsalePrefer',
    component: {
      name: false,
      options: {
        defaultValue: [4, 3],
        matchMode: 'terms'
      }
    },
    value: 'opdata_platform_bigsale_prefer'
  },
  platformSensPromotion: {
    name: '折扣敏感人群',
    desc: '通过客户的营销活动参与情况计算客户的折扣敏感度',
    key: 'platformSensPromotion',
    component: {
      name: false,
      options: {
        defaultValue: [2, 3, 4, 5],
        matchMode: 'terms'
      }
    },
    value: 'opdata_platform_sens_promotion'
  },
  platformPresalePrefer: {
    name: '预售偏好',
    desc: '根据客户的预售订单,计算客户的预售偏好程度',
    key: 'platformPresalePrefer',
    component: {
      name: false,
      options: {
        defaultValue: [4, 3],
        matchMode: 'terms'
      }
    },
    value: 'opdata_platform_presale_prefer'
  },
  platformNewGoodsPrefer: {
    name: '上新购买偏好',
    desc: '根据客户在京东的行为进行计算',
    key: 'platformNewGoodsPrefer',
    component: {
      name: false,
      options: {
        defaultValue: [4],
        matchMode: 'terms'
      }
    },
    value: 'opdata_platform_new_goods_prefer'
  },
  platformSmsClickResponse: {
    name: '短信敏感人群',
    desc: '根据短信营销客户的加购、浏览、下单行为进行计算',
    key: 'platformSmsClickResponse',
    // opdata_platform_sms_click_response、opdata_platform_sms_unclicked_response字段合并 由ClickResponse组件做特殊处理
    component: {
      name: 'clickResponse'
    },
    value: 'opdata_platform_sms_click_response'
  },
  // 会员&积分&粉丝
  shopFollowFlag: {
    name: '店铺粉丝',
    desc: '查询当天客户是否为店铺粉丝',
    key: 'shopFollowFlag',
    component: {
      name: false,
      options: {
        defaultValue: {
          value: 1
        },
        matchMode: 'term'
      }
    },
    value: 'opdata_shop_follow_flag'
  },
  shopMemberLevel: {
    name: '店铺会员',
    desc: '客户在店铺内的会员等级',
    key: 'shopMemberLevel',
    value: 'opdata_shop_member_level',
    component: {
      name: 'checkbox',
      options: {
        checkAllText: '全部会员',
        label: '会员等级',
        list: [1,2,3,4,5].reduce((arr, value) => {
          arr.push({
            label: `${value}星`,
            value
          });
          return arr;
        }, []),
        defaultValue: [],
        matchMode: 'terms'
      }
    }
  },
  shopCardMemberFlag: {
    name: '0元领卡会员',
    desc: '0元领卡入会的会员',
    key: 'shopCardMemberFlag',
    component: {
      name: false,
      options: {
        defaultValue: {
          value: 1
        },
        matchMode: 'term'
      }
    },
    value: 'opdata_shop_card_member_flag'
  },
  shopBindingCardTm: {
    name: '0元领卡入会时间',
    desc: '客户在店铺领卡的时间',
    key: 'shopBindingCardTm',
    value: 'opdata_shop_bindingcard_tm',
    component: {
      name: 'dateRange',
      options: {
        disabledDateDiff: false,
        matchMode: 'range'
      }
    }
  },
  shopPoints: {
    name: '积分余额',
    desc: '客户在店铺的积分余额',
    key: 'shopPoints',
    value: 'opdata_shop_points',
    component: {
      name: 'countGroup',
      options: {
        label: '积分余额',
        matchMode: 'range'
      }
    }
  },
  // 客户画像
  baseAge: {
    name: '年龄',
    desc: '根据客户在京东的行为进行计算',
    key: 'baseAge',
    value: 'opdata_base_age',
    component: {
      name: 'common',
      options: {
        type: 'select',
        defaultValue: 2,
        matchMode: 'term',
        list: [{label: '15岁以下', value: 1}, {label: '16-25岁', value: 2}, {label: '26-35岁', value: 3}, {label: '36-45岁', value: 4}, {label: '46-55岁', value: 5}, {label: '56岁以上', value: 6}]
      }
    }
  },
  baseSex: {
    name: '性别',
    desc: '根据客户在京东的行为进行计算',
    key: 'baseSex',
    value: 'opdata_base_sex',
    component: {
      name: 'common',
      options: {
        type: 'radio',
        matchMode: 'term',
        defaultValue: 1,
        list: [{label: '男', value: 1}, {label: '女', value: 2}]
      }
    }
  },
  baseMarriage: {
    name: '婚姻状态',
    desc: '根据客户在京东的行为进行计算',
    key: 'baseMarriage',
    value: 'opdata_base_marriage',
    component: {
      name: 'common',
      options: {
        type: 'radio',
        matchMode: 'term',
        defaultValue: 1,
        list: [{label: '已婚', value: 1}, {label: '未婚', value: 2}]
      }
    }
  },
  baseCityLevel: {
    name: '城市等级',
    desc: '根据客户常用收货地址判断客户所在城市的等级',
    key: 'baseCityLevel',
    value: 'opdata_base_city_level',
    component: {
      name: 'common',
      options: {
        type: 'select',
        matchMode: 'term',
        defaultValue: 1,
        list: [{label: '1线', value: 1}, {label: '2线', value: 2}, {label: '3线', value: 3}, {label: '4线', value: 4}, {label: '5线', value: 5}, {label: '6线', value: 6}]
      }
    }
  },
  baseArea: {
    name: '省市 ',
    desc: '根据客户常用收货地址判断客户所在的省市，可以只选择省或市',
    key: 'baseArea',
    value: 'opdata_base_area',
    component: {
      name: 'dist'
    }
  },
  baseKids: {
    name: '是否有小孩',
    desc: '根据客户在京东的行为进行计算',
    key: 'baseKids',
    value: 'opdata_base_kids',
    component: {
      name: 'common',
      options: {
        type: 'select',
        matchMode: 'term',
        defaultValue: 0,
        list: [{label: '否', value: 0}, {label: '是', value: 1}, {label: '无小孩但有购买需求', value: 2}]
      }
    }
  }
  // todo 自定义人群
};

export const tagKeyMap = {
  opdata_shop_user_value: "shopUserValue",
  opdata_shop_complete_ord_amount: "shopPayOrdAmount",
  opdata_shop_complete_ord_num: "shopCompleteOrdNum",
  opdata_shop_first_tm: "shopFirstTm",
  opdata_shop_last_ord_tm: "shopLastOrdTm",
  opdata_shop_atv: "shopAtv",
  opdata_shop_ord_incomplete_member_flag: "shopOrdIncompleteMemberFlag",
  opdata_shop_last_coupon_tm: "shopLastCouponTm",
  opdata_shop_last_cart_tm: "shopLastCartTm",
  opdata_shop_last_visit_tm: "shopLastVisitTm",
  opdata_shop_last_end_inquiry_tm: "shopLastEndInquiryTm",
  opdata_shop_last_launch_tm: "shopLastLaunchTm",
  opdata_shop_last90days_cart_skus: "shopLast90DaysCartSkus",
  opdata_shop_last90days_follow_skus: "shopLast90DaysFollowSkus",
  opdata_shop_last90days_visit_skus: "shopLast90DaysVisitSkus",
  opdata_shop_last90days_ord_cpt_skus: "shopLast90DaysOrdCptSkus",
  opdata_platform_bigsale_prefer: "platformBigsalePrefer",
  opdata_platform_sens_promotion: "platformSensPromotion",
  opdata_platform_presale_prefer: "platformPresalePrefer",
  opdata_platform_new_goods_prefer: "platformNewGoodsPrefer",
  opdata_platform_sms_click_response: "platformSmsClickResponse",
  opdata_shop_follow_flag: "shopFollowFlag",
  opdata_shop_member_level: "shopMemberLevel",
  opdata_shop_card_member_flag: "shopCardMemberFlag",
  opdata_shop_bindingcard_tm: "shopBindingCardTm",
  opdata_shop_points: "shopPoints",
  opdata_base_age: "baseAge",
  opdata_base_sex: "baseSex",
  opdata_base_marriage: "baseMarriage",
  opdata_base_city_level: "baseCityLevel",
  opdata_base_area: "baseArea",
  opdata_base_kids: "baseKids",
};

// 标签类型
export const tagTypeMap = {
  shopBehavior: {
    name: '店铺行为',
    value: 'shopBehavior',
    children: [
      // 暂时去掉下单未完成客户 tagMap.shopOrdIncompleteMemberFlag
      tagMap.shopUserValue, tagMap.shopPayOrdAmount, tagMap.shopCompleteOrdNum, tagMap.shopFirstTm, tagMap.shopLastOrdTm, tagMap.shopAtv, tagMap.shopLastCouponTm, tagMap.shopLastCartTm, tagMap.shopLastVisitTm, tagMap.shopLastEndInquiryTm, tagMap.shopLastLaunchTm
    ]
  },
  commodityBehavior: {
    name: '商品行为',
    value: 'commodityBehavior',
    children: [
      tagMap.shopLast90DaysCartSkus, tagMap.shopLast90DaysFollowSkus, tagMap.shopLast90DaysVisitSkus, tagMap.shopLast90DaysOrdCptSkus
    ]
  },
  customerPreference: {
    name: '客户偏好',
    value: 'customerPreference',
    children: [
      tagMap.platformBigsalePrefer, tagMap.platformSensPromotion, tagMap.platformPresalePrefer, tagMap.platformNewGoodsPrefer, tagMap.platformSmsClickResponse
    ]
  },
  membership: {
    name: '会员&积分&粉丝',
    value: 'membership',
    children: [
      tagMap.shopFollowFlag, tagMap.shopMemberLevel, tagMap.shopCardMemberFlag, tagMap.shopBindingCardTm, tagMap.shopPoints
    ]
  },
  customerPortrait: {
    name: '客户画像',
    value: 'customerPortrait',
    children: [
      tagMap.baseAge, tagMap.baseSex, tagMap.baseMarriage, tagMap.baseCityLevel, tagMap.baseArea, tagMap.baseKids
    ]
  },
  // fixme 自定义人群
  customPeople: {
    name: '自定义人群',
    value: 'customPeople',
    children: []
  }
};
// export const tagTypeList = [tagTypeMap.shopBehavior, tagTypeMap.commodityBehavior, tagTypeMap.customerPreference, tagTypeMap.membership, tagTypeMap.customerPortrait, tagTypeMap.customPeople];
export const tagTypeList = [tagTypeMap.shopBehavior, tagTypeMap.commodityBehavior, tagTypeMap.customerPreference, tagTypeMap.membership, tagTypeMap.customerPortrait];

/**
 * 解析日期范围参数
 * @param timeValue
 * @return {Number | String} 返回秒
 */
export function getTimeData(timeValue = '') {
  return timeValue ? parseInt((+new Date(timeValue) / 1000) + '') : '';
}

// 是否为实数
export function isNumber(value = '') {
  const reg = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
  return reg.test(value)
}
// 是否为整数
export function isInteger(value = '') {
  const reg = new RegExp('^-?[0-9]\\d*$')
  return reg.test(value)
}
// 是否为正数
export function isPositive(value = '') {
  const reg = new RegExp('^(([0-9]+[\\.]?[0-9]+)|[1-9])$')
  return reg.test(value)
}
// 是否为正整数
export function isPositiveInteger(value = '') {
  const reg = new RegExp('^\\+?[1-9][0-9]*$')
  return reg.test(value)
}

/**
 * 最多支持x位小数
 * 若isStrict为true，代表严格匹配x位小数
 * @param value
 * @param {number} fixCount 小数点后多少位
 * @param {boolean} isStrict 是否是严格模式
 * @return {boolean}
 */
export function isFixedNumber(value = '', fixCount = 1, isStrict = false) {
  const regTxt = isStrict
    ? '^(\-?[0-9]+\.[0-9]{'+fixCount+'})$'
    : '^(\-?[0-9]+|\-?[0-9]+\.[0-9]{0,'+fixCount+'})$';
  let reg = new RegExp(regTxt);
  return reg.test(value);
}
// 次数输入框组的校验
export function getRuleCount() {
  const message = '请输入一个非负整数';
  const that = this;
  return {
    start: [{
      validator(rule, value, callback) {
        const numberValue = Number(value);
        const targetValue = that.form.end;
        if (value === '') {
          targetValue ? callback() : callback(new Error('最小值最大值不能都为空'));
        } else if (!isPositiveInteger(value) && numberValue !== 0) {
          callback(new Error(message))
        } else if (targetValue) {
          numberValue > Number(targetValue)
            ? callback(new Error('最小值不能大于最大值'))
            : callback()
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }],
      end: [{
      validator(rule, value, callback) {
        const numberValue = Number(value);
        const targetValue = that.form.start;
        if (value === '') {
          targetValue ? callback() : callback(new Error('最大值最小值不能都为空'));
        } else if (!isPositiveInteger(value) && numberValue !== 0) {
          callback(new Error(message))
        } else if (targetValue !== '') {
          numberValue < Number(targetValue)
            ? callback(new Error('最大值不能小于最小值'))
            : callback()
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }]
  }
};
// 金额输入框组的校验
export function getRulePrice() {
  const message = '请输入一个非负数，最多支持2位小数';
  const that = this;
  return {
    start: [{
      validator(rule, value, callback) {
        const numberValue = Number(value);
        const targetValue = that.form.end;
        if (value === '') {
          targetValue ? callback() : callback(new Error('最小值最大值不能都为空'));
        } else if ((!isPositive(value) && numberValue !== 0) || !isFixedNumber(value, 2)) {
          callback(new Error(message))
        } else if (targetValue !== '') {
          numberValue > Number(targetValue)
            ? callback(new Error('最小值不能大于最大值'))
            : callback()
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }],
    end: [{
      validator(rule, value, callback) {
        const numberValue = Number(value);
        const targetValue = that.form.start;
        if (value === '') {
          targetValue ? callback() : callback(new Error('最大值最小值不能都为空'));
        } else if ((!isPositive(value) && numberValue !== 0) || !isFixedNumber(value, 2)) {
          callback(new Error(message))
        } else if (targetValue !== '') {
          numberValue < Number(targetValue)
            ? callback(new Error('最大值不能小于最小值'))
            : callback()
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }]
  }
};
export const conditionTypeList = [
  {
    value: 'must', label: '交'
  },
  // {
  //   value: 'should', label: '并'
  // },
  {
    value: 'must_not', label: '差'
  }
];

/**
 * 初始化默认选择的标签
 * @param {Object} campaignData 接口返回的筛选条件数据
 */
export function initSelectedTagMap(campaignData = {}) {
  let map = {};
  for (let i in tagMap) {
    if (tagMap.hasOwnProperty(i)) {
      map[i] = !!campaignData[tagMap[i].value];
    }
  }
  return map;
}

export function initSelectedTagList(conditions = "") {
  let formatConditions = conditions ? JSON.parse(conditions) : [];

  let mapList = formatConditions.map((elem)=>{
    return tagKeyMap[elem.key];
  });

  return mapList;
}


/**
 * 格式化接口返回的会员筛选条件数据
 * 返回一个map
 * @param {String | Array} conditions
 * @return {Object}
 */
export function formatConditions(conditions = '[]') {
  let _conditions = [];
  try {
    _conditions = typeof conditions === 'string'
      ? eval(conditions)
      : conditions;
  } catch (e) {
    console.warn(e);
  }
  return _conditions.reduce((obj, conditionInfo = {}) => {
    const { key = '' } = conditionInfo;
    obj[key] = conditionInfo;
    return obj;
  }, {});
}
export default 1;
