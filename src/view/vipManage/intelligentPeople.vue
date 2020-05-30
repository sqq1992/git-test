<template>
  <div class="m-content dialog_cla" v-loading="loadingPage">
    <div class="m-content-main main_height inputSet">
      <p class="m_b20 color666">星标人群</p>
      <ul class="m_b20 cusUl clearfix" v-if="cusArr.length">
        <li
          v-for="(item, index) in cusArr"
          :key="'cusArr_' + index"
          class="f-fl hidden"
        >
          <img
            @click="setStar(item, true)"
            class="cursor starImg"
            src="../../assets/images/starImg.png"
            height="31"
            width="31"
          />
          <div class="clearfix item_name">
            <span class="f-fl">{{ item.crowdName }}</span>
          </div>
          <div class="font12 m_t5 descCon hidden">
            {{ item.crowdDesc }}
          </div>
          <div
            class="text-center m_t5"
            v-if="item.customerCount || item.customerCount == 0"
          >
            <span class="item_num" @click="lookItem(item.dealSet)">{{
              item.customerCount | numFormat
            }}</span
            ><span>人</span>
          </div>
          <div
            class="text-center m_t5"
            v-if="!item.customerCount && item.customerCount != 0"
          >
            <span>计算中...</span>
          </div>
          <div class="text-center">
            <!-- 即将上线 -->
            <el-button @click="routerTo(item, 0)">立即营销</el-button>
          </div>
        </li>
      </ul>
      <div v-else class="cusUl text-center m_b20">
        暂无星标人群
      </div>
      <p class="m_b20 color666">
        人群列表<span class="color999 font12 m_l20">
          当前已有<span class="numColor">{{ num }}</span
          >个智能人群，还可新建<span class="numColor">{{
            num >= 30 ? 0 : 30 - num
          }}</span
          >个
        </span>
      </p>
      <div class="clearfix hidden m_b10">
        <span>所属分组：</span>
        <el-select
          @change="crmCrowdList(true)"
          :clearable="true"
          v-model="value"
          class="el_inp el_select row_line"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionss"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span class="m_l20">人群名称：</span>
        <el-input
          @keyup.native.enter="crmCrowdList(true)"
          v-model="input"
          class="el_inp el_input row_line"
          placeholder="请输入内容"
        ></el-input>
        <el-button @click="crmCrowdList(true)" class="m_l20" size="small"
          >查询</el-button
        >
        <el-button class="f-fr" size="small" @click="group">管理分组</el-button>
        <el-button class="f-fr" type="primary" size="small" @click="createNew"
          >新建人群</el-button
        >
      </div>
      <el-table
        class="fontClass"
        :data="tableData"
        :border="false"
        style="width: 100%"
      >
        <el-table-column
          label="人群名称"
          min-width="160"
          align="left"
          prop="crowdName"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="人群介绍"
          min-width="160"
          align="left"
          prop="crowdDesc"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="所属分组" min-width="160" align="left">
          <template scope="scope">
            <el-row>
              <el-col>
                {{ scope.row.groupName }}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="left" min-width="170">
          <template scope="scope">
            <el-row>
              <el-col>
                {{ scope.row.created }}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="客户数量" align="left" min-width="120">
          <template scope="scope">
            <el-row>
              <el-col>
                <el-button
                  type="text"
                  @click="lookItem(scope.row.dealSet)"
                  v-if="scope.row.customerCount || scope.row.customerCount == 0"
                  >{{ scope.row.customerCount | numFormat }}</el-button
                >
                <span
                  v-if="
                    !scope.row.customerCount && scope.row.customerCount != 0
                  "
                  >计算中...</span
                >
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="星标" align="left" min-width="90">
          <template scope="scope">
            <el-row>
              <el-col>
                <div class="cursor" @click="setStar(scope.row, false)">
                  <img
                    v-if="scope.row.signFlag"
                    src="../../assets/images/u534.png"
                    height="16"
                    width="16"
                  />
                  <img
                    v-else
                    src="../../assets/images/u1856.png"
                    height="16"
                    width="16"
                  />
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" min-width="140">
          <template scope="scope">
            <el-row>
              <el-col>
                <el-button v-if="!isZiying" type="text" @click="routerTo(scope.row, 1)"
                  >立即营销</el-button
                >
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button
                  class="m_l20"
                  type="text"
                  @click="deleterow(scope.row)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right" v-if="pageInfo.total">
        <el-pagination
          :current-page="pageInfo.pageNo"
          @current-change="handleCurrentChange"
          :page-size="pageInfo.pageSize"
          layout="prev, pager, next"
          :total="pageInfo.total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      class="inputSet"
      :title="rowObj ? '编辑智能人群' : '新建智能人群'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
    >
      <smallPeopleDialog
        @sureBut="sureBut"
        :options="options"
        :dialogVisible="dialogVisible"
        :rowObj="rowObj"
        :levelName="levelName"
        :levelList="levelList"
      ></smallPeopleDialog>
    </el-dialog>
    <guide-dialog ref="guideDialog"></guide-dialog>
    <activity-dialog
      ref="activityDialog"
      @closeAct="closeAct"
    ></activity-dialog>
    <marketing-dialog ref="marketingDialog"></marketing-dialog>
  </div>
</template>

<script>
import http from "./../../api/index.js";
import { point } from "src/common/point.js";
import smallPeopleDialog from "./smartProple/smallPeopleDialog";
import dateFormat from "src/common/dateFormat.js";
import guideDialog from "src/components/guide/guide.vue";
import activityDialog from "src/components/activity/activity.vue";
import marketingDialog from "src/dailog/marketingDialog";
import store from "src/store.js";
export default {
  data() {
    return {
      isZiying:store.state.ziying.isZiying,
      loadingPage: false,
      dialogVisible: false,
      num: 0,
      cusArr: [],
      options: [],
      optionss: [],
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      value: "",
      input: "",
      tableData: [],
      levelName: {},
      levelList: {},
      rowObj: {}
    };
  },
  created() {
    this.memberLevelList();
    this.starPeople();
    this.crmGroupList();
  },
  mounted() {
    //初次访问 && 页面设置未发布
    let isFirst = localStorage.getItem("wdGuideShow"),
      isGqFirst = localStorage.getItem("wdGqActShow");
    //国庆活动
    // if(new Date(store.state.user.endTime).getTime() < new Date('2019-06-01 00:00:00').getTime() && new Date().getTime() < new Date('2018-10-23 00:00:00').getTime() && !isGqFirst) {
    // this.$refs.activityDialog.show();
    // 	localStorage.setItem('wdGqActShow', 1);
    // }else {
    //     this.showGuide();
    // }
    this.showGuide();
  },
  components: {
    smallPeopleDialog,
    guideDialog,
    activityDialog,
    marketingDialog
  },
  methods: {
    //
    /**
     * 立即营销 跳转
     * @type
     * 0 星标人群
     * 1 列表人群
     */
    routerTo(row, type) {
      const h = this.$createElement;
      this.$msgbox({
          title: '温馨提示',
          message: h('div', { style: 'color: #999;line-height: 1.6;' }, [
              h('span', null, '应京东官方要求：为保障京东用户和商家数据信息安全，所有开展短信业务的服务商需统一对接官方短信通道。调整期间智能人群的营销功能暂停使用，'),
              h('span',{style:'color:red'},'你可在智能营销中按需选择标签进行会员营销'),
              h('span',null,'，带来不便尽请谅解')
          ]),
          showCancelButton:true,
          confirmButtonText: '去营销',
          cancelButtonText: '取消'
      }).then(() => {
        point(type == 0 ? "37977.39398.39417" : "37977.39398.39418");
        this.$router.push({ name: "memberZY"});
      }).catch(err => {})

    },

    showGuide() {
      let isFirst = localStorage.getItem("wdGuideShow");
      if (!isFirst) {
        localStorage.setItem("wdGuideShow", 1);
        http(
          {
            api_name: "getPublishPageInfo",
            vm: this,
            data: {}
          },
          result => {
            if (!result.data.isPublish) {
              this.$refs.guideDialog.show(1, 1);
            }
          }
        );
      } else {
        this.$refs.marketingDialog.show();
      }
    },
    closeAct() {
      this.showGuide();
    },
    sureBut(text, data) {
      //子组件事件
      this.dialogVisible = false;
      if (!text) {
        // this.crmCrowdList();
        // this.starPeople();
        /* 修改 */
        if (!data.isAdd) {
          this.tableData.forEach((item, index) => {
            if (item.id == data.id) {
              data = Object.assign({}, item, data);
              this.$set(this.tableData, index, data);
              if (data.signFlag) {
                /* 如果是星标的话，则优先同步 星标列表 */
                this.cusArr.forEach((ele, i) => {
                  if (ele.id == data.id) {
                    this.$set(this.cusArr, i, data);
                    this.queryGroupNumber(this.cusArr[i]);
                  }
                });
              } else {
                this.queryGroupNumber(this.tableData[index]);
              }
            }
          });
        } else {
          delete data.isAdd;
          this.tableData.unshift(data);
          if (this.tableData.length > 10) {
            this.tableData.pop();
          }
          this.queryGroupNumber(this.tableData[0]);
        }
      }
    },
    crmGroupList() {
      //查询分组列表
      http(
        {
          api_name: "crmGroupList",
          vm: this,
          data: {}
        },
        res => {
          this.options = res.data
            ? res.data.crmGroupList
              ? res.data.crmGroupList
              : []
            : [];
          this.optionss = [];
          // this.optionss = res.data ? (res.data.crmGroupList ? res.data.crmGroupList : []) : [];
          this.optionss.push({
            groupName: "不限",
            id: ""
          });
          this.options.forEach(item => {
            this.optionss.push(item);
          });
          this.crmCrowdList();
        },
        error => {}
      );
    },
    starPeople() {
      //查询星标人群
      http(
        {
          api_name: "crmCrowdSign",
          vm: this,
          data: {
            type: 0
          }
        },
        res => {
          // this.loadingPage = false;
          this.cusArr = res.data
            ? res.data.signList
              ? res.data.signList
              : []
            : [];
          this.cusArr.forEach(item => {
            this.queryGroupNumber(item);
          });
        },
        error => {
          this.loadingPage = false;
        }
      );
    },
    queryGroupNumber(item, cb) {
      http(
        {
          api_name: "queryCrowdCount",
          data: {
            dealSet: item.dealSet
          },
          vm: this
        },
        result => {
          this.$set(item, "customerCount", result.data.count);
          /* 如果当前查询的是 星标人群，则将  人群列表中的 星标人群进行更改 */
          // if(item.signFlag){
          /* 低效率大循环体，因为异步的原因 暂时没有想到该如何进行同步 双向数据 */
          this.cusArr.forEach((ele, index) => {
            this.tableData.some((data, i) => {
              if (ele.id == data.id) {
                this.$set(data, "customerCount", ele.customerCount);
                return true;
              }
            });
          });
          // }
          cb && cb(result.data.count);
        }
      );
    },
    crmCrowdList(flag) {
      //查询人群列表
      if (flag) {
        this.pageInfo.pageNo = 1;
      }
      this.loadingPage = true;
      http(
        {
          api_name: "crmCrowdList",
          vm: this,
          data: {
            crowdName: this.input,
            groupId: this.value,
            page: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          }
        },
        res => {
          try {
            let data = res.data
              ? res.data.crmCrowdList
                ? res.data.crmCrowdList
                : []
              : [];
            /**
             * 发现后端在进行分组名称更新的时候，没有将  人群的所属分组的名称进行更新，为了 不麻烦起见，前端自己去进行匹配，更改最新的 分组名称
             */
            data.forEach(item => {
              this.options.forEach(group => {
                if (item.groupId == group.id) {
                  item.groupName = group.groupName;
                }
              });
            });
            this.tableData = data;
            this.num = res.data.allTotal;
            this.pageInfo.total = res.data.allTotal;
            // this.pageInfo.total = res.data ? (res.data.total ? res.data.total : (res.data.crmCrowdList ? res.data.crmCrowdList.length : 0)) : 0;
            this.loadingPage = false;
            this.tableData.forEach(item => {
              /* 如果不是星标人群，则进行 数量查询，星标人群 交给单独接口进行操作 */
              if (!item.signFlag) {
                this.queryGroupNumber(item);
              } else {
                this.cusArr.some((ele, index) => {
                  if (ele.id == item.id) {
                    this.$set(item, "customerCount", ele.customerCount);
                    return true;
                  }
                });
              }
            });
          } catch (e) {
            console.log(e);
          }
        },
        error => {
          this.loadingPage = false;
        }
      );
    },
    setStar(item, flag) {
      //设置星标
      let message = item.signFlag
        ? "确定取消此星标人群设置吗？"
        : "确定设置为星标人群吗？";
      this.$confirm(message, "星标设置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          let star = item.signFlag ? 0 : 1;
          this.loadingPage = true;
          http(
            {
              api_name: "crmCrowdSetSign",
              vm: this,
              data: {
                id: item.id,
                signFlag: star
              }
            },
            res => {
              point("37977.39398.39419");
              this.loadingPage = false;
              // this.starPeople();
              // this.crmCrowdList();
              /* 取消星标人群，进行 人群的remove */
              try {
                if (item.signFlag) {
                  this.cusArr.some((ele, index) => {
                    if (ele.id == item.id) {
                      this.cusArr.splice(index, 1);
                      return true;
                    }
                  });
                  this.tableData.some((ele, index) => {
                    if (ele.id == item.id) {
                      this.$set(ele, "signFlag", 0);
                      return true;
                    }
                  });
                } else {
                  this.tableData.some((ele, index) => {
                    if (ele.id == item.id) {
                      this.$set(ele, "signFlag", 1);
                      return true;
                    }
                  });
                  this.cusArr.push(item);
                }
              } catch (e) {
                console.error(e);
              }
            },
            error => {
              this.loadingPage = false;
            }
          );
        })
        .catch(() => {});
    },
    handleCurrentChange(e) {
      //翻页
      this.pageInfo.pageNo = Number(e);
      this.crmCrowdList();
    },
    createNew() {
      //新建人群
      if (this.pageInfo.total >= 30) {
        this.$message.error("每个店铺最多可创建30个人群！");
        return;
      }
      this.rowObj = 0;
      this.dialogVisible = true;
    },
    group() {
      //管理分组
      this.$router.push({
        path: "/manageGroup"
      });
    },
    edit(item) {
      //编辑人群
      this.rowObj = item;
      this.dialogVisible = true;
    },
    deleterow(item) {
      this.$confirm("确定删除此人群吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.loadingPage = true;
          http(
            {
              api_name: "crmCrowdDelete",
              vm: this,
              data: {
                id: item.id,
                modelId: item.modelId,
                crowdName: item.crowdName,
                groupId: item.groupId
              }
            },
            res => {
              point("37977.39398.39420");

              this.loadingPage = false;
              this.crmCrowdList();
              if (item.signFlag) {
                this.cusArr.some((obj, i) => {
                  if (obj.id == item.id) {
                    this.cusArr.splice(i, 1);
                    return true;
                  }
                });
              }
            },
            error => {
              this.loadingPage = false;
            }
          );
        })
        .catch(() => {});
    },
    memberLevelList() {
      //会员等级规则
      let _self = this;
      http(
        {
          api_name: "memberLevelList",
          vm: this,
          data: {}
        },
        res => {
          let obj = {};
          let lebelObj = {};
          let arr = res.data
            ? res.data.levelList
              ? res.data.levelList
              : []
            : [];
          arr.forEach(item => {
            obj[item.memberLevel] = item.name ? item.name : item.nameSource;
            if (item.name) {
              lebelObj[item.name] = item.memberLevel;
            } else {
              lebelObj[item.nameSource] = item.memberLevel;
            }
          });
          this.levelName = obj;
          this.levelList = lebelObj;
        },
        error => {}
      );
    },
    lookItem(obj = "") {
      if (obj) {
        obj = JSON.parse(obj);
      }
      if (obj.timeType === 0) {
        /* 如果条件选择的是 相对时间，则进行格式转化 */
        obj.rType = 1;
        obj.minLastTradeDate =
          new Date(dateFormat(new Date(obj.maxLastTradeTime), "YY-MM-DD")) * 1;
        obj.maxLastTradeDate =
          new Date(dateFormat(new Date(obj.minLastTradeTime), "YY-MM-DD")) * 1;
        let nowDate = new Date(dateFormat(new Date(), "YY-MM-DD")) * 1;
        let day = 24 * 3600 * 1000;
        /* 会员列表参数 设置的是  从当前天数往前推，所以这里需要逆反下 */
        let minType = obj.minLastTradeDate > nowDate ? "-" : "";
        let maxType = obj.maxLastTradeDate > nowDate ? "-" : "";
        obj.minLastTradeDate =
          minType + Math.floor(Math.abs(obj.minLastTradeDate - nowDate) / day);
        obj.maxLastTradeDate =
          maxType + Math.floor(Math.abs(obj.maxLastTradeDate - nowDate) / day);
      }
      console.log(obj);
      this.$router.push({
        path: "/vipList",
        query: {
          name: 1,
          /* 累计成交次数 */
          dealOne: obj.minTradeCount || "",
          dealTwo: obj.maxTradeCount || "",
          dealType: obj.fType || obj.fType == 0 ? obj.fType : "",
          /* 最后交易时间 */
          dateOne: obj.minLastTradeDate || "",
          dateTwo: obj.maxLastTradeDate || "",
          dateType: obj.rType || obj.rType == 0 ? obj.rType : "",
          /* 会员等级 */
          grades: obj.grade || "",
          /* 平均客单价 */
          pType: obj.yType || obj.yType == 0 ? obj.yType : "",
          priceOne: obj.minAvgPrice || "",
          priceTwo: obj.maxAvgPrice || "",
          /* 累计成交金额 */
          xType: obj.xType || obj.xType == 0 ? obj.xType : "",
          mOne: obj.minTradeAmount || "",
          mTwo: obj.maxTradeAmount || ""
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.m-content {
  .m-content-main {
    font-size: 14px;
    padding: 17px 25px 30px 15px;
    box-sizing: border-box;
    min-width: 1050px;
  }
  .numColor {
    color: #ff892a;
  }
  .color666 {
    color: #666;
  }
  .color999 {
    color: #999;
  }
  .header {
    height: 28px;
    line-height: 28px;
  }
  .cusUl {
    width: 100%;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(215, 215, 215);
    overflow: hidden;
    li {
      //width: 250px;
      width: 182px;
      margin-right: 20px;
      border: 1px solid rgba(211, 214, 216, 0.36);
      box-sizing: border-box;
      padding: 10px;
      //box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.2);
      //min-width: 240px;
      margin-bottom: 20px;
      position: relative;
      box-shadow: 0px 3px 12px 0px rgba(211, 214, 216, 0.36);
      border-radius: 4px;
      .starImg {
        position: absolute;
        top: -1px;
        right: -3px;
      }
      .item_name {
        height: 20px;
        font-size: 16px;
        color: #333;
        img {
          vertical-align: middle;
          margin: 2px 0 0 2px;
        }
        span {
          display: inline-block;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .descCon {
        //height: 32px;
        height: 48px;
        font-size: 12px;
        color: #666;
      }
      .item_num {
        font-size: 30px;
        // font-weight: 700;
        color: #3a9af6;
        cursor: pointer;
        &:hover {
          color: #4db3ff;
        }
      }
    }
  }
  .el_select {
    width: 140px;
  }
  .el_input {
    width: 200px;
  }
}
</style>
