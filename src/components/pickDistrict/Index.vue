<template>
  <div>
    <el-select
      v-model="province"
      @change="onProvinceChange"
      placeholder="请选择省份"
      :disabled="isDisabled"
      style="width: 140px;">
      <el-option
        v-for="info in districts"
        :key="info.code"
        :label="info.name"
        :value="info.code">
      </el-option>
    </el-select>
    <el-select
      v-model="city"
      @change="onCityChange"
      placeholder="请选择城市"
      :disabled="isDisabled"
      style="width: 140px;">
      <el-option
        v-for="info in currentCities"
        :key="info.code"
        :label="info.name"
        :value="info.code">
      </el-option>
    </el-select>
    <!--暂时隐藏区县-->
    <!--<el-select-->
      <!--v-model="district"-->
      <!--@change="onDistrictChange"-->
      <!--placeholder="请选择区县"-->
      <!--:disabled="isDisabled"-->
      <!--style="width: 140px;">-->
      <!--<el-option-->
        <!--v-for="info in currentDistricts"-->
        <!--:key="info.code"-->
        <!--:label="info.name"-->
        <!--:value="info.code">-->
      <!--</el-option>-->
    <!--</el-select>-->
  </div>
</template>
<script>
  // import districts from '@/common/district2';
  import districts from '@/common/districts';
  import { getProperValue } from "@/common/utils";
  export default {
    name: "pick-district",
    props: {
      // v-model
      value: {
        type: Array,
        default() {
          return [];
        },
        required: true
      },
      // 是否禁用
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const initValue = this.initialValue(this.value || []);
      return {
        province: initValue.province,
        city: initValue.city,
        district: initValue.district,
        // 省市区源数据
        districts: districts
      };
    },
    computed: {
      currentProvince() {
        const province = this.province;
        const districts = this.districts || [];
        if (!province) return {};
        return districts.find(item => item.code === province) || {};
      },
      currentCities() {
        // return districts[this.province] || {};
        const {
          areas = []
        } = this.currentProvince || {};
        return areas;
      }
      /*currentCity() {
        const city = this.city;
        const cities = this.currentCities || [];
        if (!city) return {};
        return cities.find(item => item.code === city) || {};
      },
      currentDistricts() {
        // return districts[this.city] || {};
        const {
          areas = []
        } = this.currentCity || {};
        return areas;
      }*/
    },
    methods: {
      /**
       * 初始化省市区，并将初始值强制转为string
       * @param value
       * @return {{province: string, city: string, district: string}}
       */
      initialValue(value) {
        const _value = value || this.value || [];
        return {
          province: getProperValue(_value[0]) + '',
          city: getProperValue(_value[1]) + '',
          district: getProperValue(_value[2]) + ''
        };
      },
      onProvinceChange(value = '') {
        this.city = '';
        this.district = '';
        this.update();
      },
      onCityChange(value = '') {
        this.district = '';
        this.update();
      },
      onDistrictChange(value = '') {
        this.update();
      },
      update() {
        this.$emit("input", [this.province, this.city, this.district]);
      }
    }
  }
</script>
