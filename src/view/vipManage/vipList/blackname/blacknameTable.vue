<template>
  <div class="dealVipTable">
    <el-table
      class="fontClass"
      :data="tableData"
      :border="false"
      v-loading="loading"
      style="width: 100%">
      <el-table-column label="会员账号" min-width="140" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
              <span v-if="scope.row.type === '1'">
                <span v-if="scope.row.name">{{scope.row.name}}</span>
                <el-tooltip :content="scope.row.customerPin" popper-class="my_poper" placement="top" v-else-if="scope.row.customerPin">
                  <span class="clamp_two_row">
                    <span class="mi_icon">密</span>
                    {{scope.row.customerPin}}
                  </span>
                </el-tooltip>
              </span>
              <span v-else>-</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="手机号" align="left" min-width="120">
        <template scope="scope">
          <el-row>
            <el-col class="">
              {{scope.row.type === '2' ? scope.row.name : '-'}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
       <el-table-column label="会员昵称" align="left" min-width="60">
        <template scope="scope">
          <el-row>
            <el-col class="">
              {{scope.row.userNick || '-'}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="left" min-width="60">
        <template scope="scope">
          <el-row>
            <el-col class="">
              {{scope.row.type === '1' ? "会员账号" : "手机号"}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" min-width="80">
        <template scope="scope">
          <el-row>
            <el-col>
              <el-button type="text" @click="handleRemove(scope.row)">移除黑名单</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import http from 'src/api'
  export default{
    data() {
      return{
        dialogVisible: false,
        vipDetail: {},
        statusObj: {
          '0': '未激活',
          '1': '已激活'
        },
        loading:false
      }
    },
    props: {
      tableData: Array
    },
    methods: {
      // 移除黑名单
      handleRemove({id,name}) {
        this.$confirm(`确定将${name}移出黑名单？`,'移除黑名单').then(() => {
          this.delete(id);
        }).catch(() => {})
      },
      delete(id) {
        this.loading = true;
        http({
          api_name:'deleteBlackList',
          data:{id}
        },res => {
          this.$emit('refresh');
          this.loading = false;

        })
      },
      closeDia() {
        this.dialogVisible = false;
      },


    },
    components: {
    }
  }
</script>

<style lang="less" scoped>

</style>
