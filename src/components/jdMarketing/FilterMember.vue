<template>
    <div class="reset-el-input-wrap" v-loading="loading">
      <el-form ref="basicForm" :model="basicForm" :rules="basicFormRules" @submit.native.prevent>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="basicForm.name" style="width: 200px;"></el-input>
        </el-form-item>
      </el-form>
      <!--营销目标选择-->
      <p class="m_b10" style="line-height: 20px;">
        <sup class="el-badge__content badge-blue">1</sup>营销目标选择
      </p>
      <manage-tag ref="manageTag" :campaignData="campaignData" :conditions="conditions"></manage-tag>

      <!--人群过滤-->
      <template v-if="showPeopleForm">
        <p class="m_t10 m_b10" style="line-height: 20px;">
          <sup class="el-badge__content badge-blue">2</sup>人群过滤
        </p>
        <el-form :inline="true" ref="peopleForm" :model="peopleForm" :rules="peopleFormRules">
          <!--<el-form-item>-->
          <!--<el-checkbox v-model="peopleForm.filterBlacklist" :true-label="1" :false-label="0">不发送黑名单</el-checkbox>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-checkbox v-model="peopleForm.isSendSms">不发送最近</el-checkbox>
          </el-form-item>
          <el-form-item prop="filterSendDays">
            <el-input v-model="peopleForm.filterSendDays" class="m_r10" style="width: 170px;"></el-input>天发送过短信的会员(含今天)
          </el-form-item>
        </el-form>
      </template>
      <!--人群数量预测-->
      <p class="m_t10 m_b10" style="line-height: 20px;">
        <sup class="el-badge__content badge-blue">2</sup>人群数量预测
      </p>
      <div>
        <el-button plain type="primary" size="small" :disabled="isPredicting" :loading="isPredicting" @click="handlePredict">
          立即预测
        </el-button>
        <span v-show="isPredicted" class="ml10">
          共筛选出<span style="color: #f00">{{sendNum}}</span>人
        </span>
      </div>
      <div class="fc--red" v-if="isCold">您已经很久或从未使用过京东短信通道，需要将您重新激活为活跃用户后才能正常使用，这个过程可能需要几分钟，请您稍后点击【立即预测】按钮重试</div>
      <div class="text-center" style="padding-top: 30px;padding-bottom: 20px;">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button type="primary" size="small" :disabled="loading" @click="handleSubmit">编辑短信内容</el-button>
      </div>
    </div>
</template>

<script>
import { propsCampaignData } from './tag/mixin';
import manageTag from './FilterMemberManageTag';
export default {
  mixins: [propsCampaignData],
  name: 'jd-marketing-filter-member',
  props: {
    otherCampaignData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    manageTag
  },
  data() {
    const isPositiveIntegerRegExp = new RegExp('^\\+?[1-9][0-9]*$');
    const that = this;
    const otherCampaignData = this.otherCampaignData || {};
    return {
      loading: false,
      // 活动名称form
      basicForm: this.initBasicForm(otherCampaignData),
      lastCondition:'',//上一次筛选条件
      basicFormRules: {
        name: [{
          required: true, message: '请输入活动名称', trigger: 'blur'
        }]
      },
      // 人群过滤form
      peopleForm: this.initPeopleForm(otherCampaignData),
      peopleFormRules: {
        filterSendDays: [{
          validator(rule, value, callback) {
            const isSendSms = that.peopleForm.isSendSms;
            // 选择不发送时，需要校验发送天数是否为正整数
            if (isSendSms) {
              isPositiveIntegerRegExp.test(value)
              ? callback()
              : callback(new Error('发送天数必须为一个正整数'))
            }
            callback()
          },
          trigger: 'blur'
        }]
      },
      // 预测请求状态 none -> 未请求, ing -> 请求, success -> 请求成功, fail -> 请求失败
      predictState: 'none',
      // 人群预测数量
      sendNum: 0,
      showPeopleForm: false,
      isCold:false
    };
  },
  computed: {
    // 是否预测成功
    isPredicted() {
      return this.predictState === 'success';
    },
    // 是否预测中
    isPredicting() {
      return this.predictState === 'ing';
    }
  },
  methods: {
    // 初始化基本信息 表单
    initBasicForm(data = {}) {
      const {
        // 活动名称
        name = '智能营销' + Date.now()
      } = data;
      return {
        name
      };
    },
    // 初始化人群过滤信息 表单
    initPeopleForm(data = {}) {
      const {
        // 不发送黑名单(过滤黑名单)
        filterBlacklist = 1,
        // 不发送最近x天发送过短信的会员(input)
        filterSendDays = ''
      } = data;
      const isSendSms = !!filterSendDays; // 不发送最近x天发送过短信的会员(checkbox)
      return {
        filterBlacklist,
        filterSendDays,
        isSendSms
      };
    },
    validate() {
      const $refs = this.$refs;
      // fixme 低版本的element-ui的form验证只能用这种callback(isValid: Boolean)的方式
      return Promise.all([
        // 基本信息
        new Promise((resolve, reject) => {
          $refs.basicForm.validate(isValid => {
            isValid ? resolve() : reject(new Error('basicForm error'));
          });
        }),
        // 人群过滤信息
        // new Promise((resolve, reject) => {
        //   $refs.peopleForm.validate(isValid => {
        //     isValid ? resolve() : reject(new Error('peopleForm error'));
        //   });
        // }),
        // 校验是否预测人群数量
        new Promise((resolve, reject) => {
          this.sendNum ? resolve() : this.$message.warning('未筛选出人群!') && reject('未筛选出人群');
        }),
        //检测筛选条件是否变更
        new Promise((resolve, reject) => {
          this.lastCondition && (JSON.stringify(this.lastCondition) !== JSON.stringify(this.getTagData()))
            ? this.$message.warning('筛选条件已修改，请重新预测！') && reject('筛选条件已修改，请重新预测！')
            : resolve()
        })
        // 校验标签
      ].concat($refs.manageTag.validate()))
    },
    validateTag() {
      const promiseList = this.$refs.manageTag.validate();
      return Promise.all(promiseList);
    },
    // 获取参数
    getData() {
      const basicForm = this.basicForm;
      const peopleData = this.getPeopleData();
      return {
        ...basicForm,
        ...peopleData,
        conditions: this.getTagData(),
        sendNum: this.sendNum
      };
    },
    getPeopleData() {
      const peopleForm = this.peopleForm;
      let {
        // filterBlacklist = 1,
        filterSendDays = '',
        isSendSms = false
      } = peopleForm;
      // 未选中时，filterSendDays置为空
      if (!isSendSms) {
        filterSendDays = ''
      }
      return {
        // filterBlacklist,
        // filterSendDays,
      };
    },
    getTagData() {
      return this.$refs.manageTag.getData();
    },
    // 预测
    handlePredict() {
      this.validateTag()
        .then((result) => {
          this.fetchPredict();
        })
        .catch(err => {
          if (typeof err === 'string') {
            this.$message.warning(err);
          }
          throw new Error(err);
        });
    },
    // 请求接口-预测
    fetchPredict() {
      const params = this.getTagData();
      const peopleData = this.getPeopleData();
      this.lastCondition = params;//保存查询条件
      let _params = {
        conditions: params,
        ...peopleData
      };
      this.predictState = 'ing';
      this.$http({
        api_name: 'jdMarketing_predict',
        data: _params
      }, ({ data = {} }) => {
        this.predictState = 'success';
        const {
          member = 0
        } = data;
        this.sendNum = member;
      }, (err = {}) => {
        this.$message.error(err.message || '请求失败');
        this.predictState = 'fail';
      });
      this.$http({
        api_name: 'checkDataState',
      },({data = {}}) => {
        if(data.needPush) {
          this.$message.warning('您已经很久或从未使用过京东短信通道，需要将您重新激活为活跃用户后才能正常使用，这个过程可能需要几分钟，请您稍后点击【立即预测】按钮重试')
          this.isCold = true;
        } else {
          this.isCold = false;
        }
      })
    },
    // 取消/关闭
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      this.validate()
        .then(() => {
          this.$emit('next')
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  }
}
</script>
