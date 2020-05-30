<template>
  <div>
    <welfare-top v-if="actType == 'welfare'"></welfare-top>
    <interaction-top v-else></interaction-top>
    <div class="list fontClass" v-loading="listLoading">
      <div>
        <span class="ui-filter-item-group">
          <span class="ui-filter-hd">活动名称：</span>
          <span>{{interactionMsg.actName}}</span>
        </span>
        <span class="ui-filter-item-group">
          <span class="ui-filter-hd w100">活动起止时间：</span>
          <span>{{interactionMsg.startTime}} 至 {{interactionMsg.type == '7'&& interactionMsg.endTime == '2037-12-31 23:59:59' ? '永久' : interactionMsg.endTime}}</span>
        </span>
      </div>
      <div>
        <span class="ui-filter-item-group">
          <span
            class="ft-12"
            v-if="interactionMsg.type == '4' || interactionMsg.type == '6' || interactionMsg.type == '5' || interactionMsg.type == '12'"
          >邀请者账号：</span>
          <span v-else class="ui-filter-hd">会员账号：</span>
          <el-input v-model="queryData.userNick" style="width: auto;"></el-input>
        </span>
        <span
          class="ui-filter-item-group"
          v-if="interactionMsg.type == '4' || interactionMsg.type == '6' || interactionMsg.type == '5' || interactionMsg.type == '12'"
        >
          <span class="ft-12">被邀请者账号：</span>
          <el-input v-model="queryData.invitationUserNick" style="width: auto;"></el-input>
        </span>
        <span class="ui-filter-item-group">
          <span class="ui-filter-hd">参与时间：</span>
          <el-date-picker
            v-model="queryData.startTime"
            type="date"
            placeholder="选择日期"
            class="ui-filter-pd"
            :picker-options="pickerStartTime"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="queryData.endTime"
            type="date"
            placeholder="选择日期"
            class="ui-filter-pd"
            :picker-options="pickerEndTime"
          ></el-date-picker>
        </span>
        <span
          class="ui-filter-item-group"
          v-if="interactionMsg.type == '6' || interactionMsg.type == '5' || interactionMsg.type == '8'"
        >
          <span class="ui-filter-hd">参与结果：</span>
          <el-select v-model="queryData.status" class="ui-filter-pd">
            <el-option :value="'-2'" label="不限"></el-option>
            <el-option :value="'1'" label="成功"></el-option>
            <el-option :value="'-1'" label="失败"></el-option>
            <el-option :value="'0'" label="进行中"></el-option>
          </el-select>
        </span>
        <el-button size="small" @click="getPartakeList(1)" class="queryBtn">查询</el-button>
        <el-button size="small" type="primary" @click="downLoadList()" class="queryBtn">导出参与记录</el-button>
      </div>
      <div
        v-if="interactionMsg.type == 7"
        style="font-size:12px;color:#999;margin-top:10px;"
      >用户在9月17日（含）功能发布前填写的信息，只能查看填写类型，无法查询具体填写内容。但是之前填写内容会被记录到用户资料当中；</div>
      <div
        class="list_table"
        v-if="interactionMsg.type == '4' || interactionMsg.type == '6' || interactionMsg.type == '5' || interactionMsg.type == '12'"
      >
        <el-table :data="tableData" :border="false" style="width: 100%">
          <el-table-column label="邀请者账号" min-width="18%" align="left">
            <template scope="scope">
              <el-row>
                <el-col>
                  <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                  <el-tooltip
                    :content="scope.row.customerPin"
                    popper-class="my_poper"
                    placement="top"
                    v-else-if="scope.row.customerPin"
                  >
                    <span class="clamp_two_row">
                      <span class="mi_icon">密</span>
                      {{scope.row.customerPin}}
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column label="邀请者昵称" min-width="18%" align="left">
                  <template scope="scope">
                      <el-row>
                          <el-col>
                              {{scope.row.userNick}}
                          </el-col>
                      </el-row>
                  </template>
          </el-table-column>-->
          <el-table-column label="被邀请者账号" align="left" min-width="18%">
            <template scope="scope">
              <el-row>
                <el-col>
                  <span v-if="scope.row.invitationPin">{{scope.row.invitationPin}}</span>
                  <el-tooltip
                    :content="scope.row.invitationCustomerPin"
                    popper-class="my_poper"
                    placement="top"
                    v-else-if="scope.row.invitationCustomerPin"
                  >
                    <span class="clamp_two_row">
                      <span class="mi_icon">密</span>
                      {{scope.row.invitationCustomerPin}}
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column label="被邀请者昵称" align="left" min-width="18%">
                  <template scope="scope">
                      <el-row>
                          <el-col>
                              {{scope.row.invitationUserNick}}
                          </el-col>
                      </el-row>
                  </template>
          </el-table-column>-->
          <el-table-column
            :label="interactionMsg.type == '6'  || interactionMsg.type == '5' ? '参与活动时间' : interactionMsg.type == '12' ? '成功邀请时间' : '成功关注时间'"
            align="left"
            :min-width="interactionMsg.type == '6'  || interactionMsg.type == '5'?'15%':'20%'"
          >
            <template scope="scope">
              <el-row>
                <el-col>{{scope.row.paertInTime}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="参与结果"
            align="left"
            min-width="13%"
            v-if="interactionMsg.type == '6'  || interactionMsg.type == '5'"
          >
            <template scope="scope">
              <el-row>
                <el-col>
                  <span :class="resultColor[scope.row.status]">{{statusMap[scope.row.status]}}</span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="table_footer" v-if="total">
          <el-pagination
            layout="prev, pager, next"
            :current-page="queryData.pageNo"
            :page-size="queryData.pageSize"
            @current-change="getPartakeList"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <div class="list_table" v-else>
        <el-table :data="tableData" :border="false" style="width: 100%">
          <el-table-column label="会员账号" min-width="25%" align="left">
            <template scope="scope">
              <el-row>
                <el-col>
                  <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                  <el-tooltip
                    :content="scope.row.customerPin"
                    popper-class="my_poper"
                    placement="top"
                    v-else-if="scope.row.customerPin"
                  >
                    <span class="clamp_two_row">
                      <span class="mi_icon">密</span>
                      {{scope.row.customerPin}}
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column label="会员昵称" min-width="25%" align="left">
            <template scope="scope">
              <el-row>
                <el-col>{{scope.row.userNick}}</el-col>
              </el-row>
            </template>
          </el-table-column> -->
          <el-table-column label="参与时间" align="left" min-width="25%">
            <template scope="scope">
              <el-row>
                <el-col>{{scope.row.paertInTime}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            :label="interactionMsg.type == '7' ? '提交类型':'奖励'"
            align="left"
            min-width="25%"
            v-if="interactionMsg.type != '5'"
          >
            <template scope="scope">
              <el-row>
                <el-col v-if="interactionMsg.type == '7'">{{perfectMap[scope.row.content]}}</el-col>
                <el-col v-else>{{scope.row.award}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            label="提交内容"
            align="left"
            min-width="25%"
            v-if="interactionMsg.type == '7' "
          >
            <template scope="scope">
              <el-row>
                <el-col>{{scope.row.contentValue || '-'}}</el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="table_footer" v-if="total">
          <el-pagination
            layout="prev, pager, next"
            :current-page="queryData.pageNo"
            :page-size="queryData.pageSize"
            @current-change="getPartakeList"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import interactionTop from "src/components/integral-interaction/interaction-statistics-top";
import welfareTop from "src/components/integral-interaction/welfare-statistics-top";
import ajax from "src/api/index.js";
import { clone } from "src/common/public.js";
import dateFormat from "../../../common/dateFormat.js";
export default {
  props: {
    actType: {
      type: String,
      default: "interaction"
    }
  },
  data() {
    return {
      tableData: [],
      listLoading: false,
      interactionMsg: {},
      statusMap: {
        "-2": "不限",
        "1": "成功",
        "-1": "失败",
        "0": "进行中"
      },
      resultColor: {
        "1": "green",
        "-1": "red"
      },
      perfectMap: {
        telephone: "手机号",
        birthday: "生日",
        profession: "职业",
        sex: "性别",
        email: "邮箱"
      },
      queryData: {
        pageNo: 1,
        pageSize: 20,
        startTime: "",
        endTime: "",
        userNick: "",
        id: "",
        InvitationUserNick: "",
        status: "-2"
      },
      total: 0,
      pickerStartTime: {
        disabledDate(time) {
          return false;
        }
      },
      pickerEndTime: {
        disabledDate(time) {
          return false;
        }
      }
    };
  },
  watch: {
    "queryData.startTime"(val) {
      if (val) {
        this.pickerEndTime = {
          disabledDate(time) {
            return time.getTime() < new Date(val);
          }
        };
      } else {
        this.pickerEndTime = {
          disabledDate(time) {
            return false;
          }
        };
      }
    },
    "queryData.endTime"(val) {
      if (val) {
        this.pickerStartTime = {
          disabledDate(time) {
            return time.getTime() > new Date(val);
          }
        };
      } else {
        this.pickerStartTime = {
          disabledDate(time) {
            return false;
          }
        };
      }
    }
  },
  created() {
    let json = JSON.parse(sessionStorage.getItem("interactionMsg"));
    this.$set(this, "interactionMsg", json);
    this.queryData.id = json.id;
    this.getPartakeList(1);
  },
  components: {
    interactionTop,
    welfareTop
  },
  methods: {
    getPartakeList(page) {
      this.queryData.pageNo = page || this.queryData.pageNo;
      this.listLoading = true;
      let queryData = clone(this.queryData);
      queryData.startTime = queryData.startTime
        ? dateFormat(queryData.startTime, "YY-MM-DD HH:MM:SS")
        : "";
      queryData.endTime = queryData.endTime
        ? dateFormat(queryData.endTime, "YY-MM-DD") + " 23:59:59"
        : "";
      switch (this.interactionMsg.type) {
        case "4":
          queryData.activityType = "dynamic_invitationPeople";
          break;
        case "5":
          queryData.activityType = "dynamic_bargain";
          break;
        case "6":
          queryData.activityType = "collage";
          break;
        case "8":
          queryData.activityType = "newcomer_activity";
          break;
        case "12":
          queryData.activityType = "dynamic_invitationWareFollow";
          break;
        default:
          break;
      }
      ajax(
        {
          api_name: "activityRecord",
          data: queryData,
          vm: this
        },
        result => {
          this.tableData = result.data.list;
          this.total = result.data.total;
          this.listLoading = false;
        }
      );
    },
    downLoadList() {
      let queryData = clone(this.queryData);
      queryData.startTime = queryData.startTime
        ? dateFormat(queryData.startTime, "YY-MM-DD HH:MM:SS")
        : "";
      queryData.endTime = queryData.endTime
        ? dateFormat(queryData.endTime, "YY-MM-DD") + " 23:59:59"
        : "";
      switch (this.interactionMsg.type) {
        case "4":
          queryData.activityType = "dynamic_invitationPeople";
          break;
        case "5":
          queryData.activityType = "dynamic_bargain";
          break;
        case "6":
          queryData.activityType = "collage";
          break;
        case "8":
          queryData.activityType = "newcomer_activity";
          break;
        default:
          break;
      }
      delete queryData.pageNo;
      delete queryData.pageSize;
      let queryArr = [];
      for (let key in queryData) {
        queryArr.push(key + "=" + queryData[key]);
      }
      window.open(
        "//testpcjdcrm.wangdiankeji.com/activity/downloadActivityRecord?" +
          queryArr.join("&")
      );
      // ajax({
      //   api_name:'downloadActivityRecord',
      //   data: queryData,
      //   method:'GET'
      // })
    }
  }
};
</script>

<style lang="less">
.ui-filter-item-group {
  display: inline-block;
  margin-right: 20px;
  margin-top: 10px;
  .ft-12 {
    font-size: 12px;
  }
  .ui-filter-hd {
    display: inline-block;
    width: 60px;
    text-align: right;
    font-size: 12px;
  }
  .w100 {
    width: 100px;
  }
  .el-input {
    height: 30px;
    .el-input__inner {
      height: 100%;
    }
  }
  .ui-filter-pd {
    width: 140px;
  }
}
</style>
<style lang="less" scoped>
.list {
  padding: 10px 20px;
  .list_table {
    margin-top: 20px;
  }
  .table_footer {
    text-align: right;
  }
  .queryBtn {
    vertical-align: middle;
    margin-top: 3px;
  }
  .red {
    color: red;
  }
  .green {
    color: green;
  }
}
</style>
