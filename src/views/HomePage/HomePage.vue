<template>
  <div class="home-page">
    <div class="test-text">isOk: {{ store.isOk }} - testNum: {{ testNum }}</div>
    <el-button type="primary" @click="changeStore">changeStore</el-button>
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <el-button type="primary" size="default" @click="push">inject</el-button>
    <el-button @click="toTestPage">to testPage</el-button>
  </div>
</template>
<script setup lang="ts">
import useCounterStore from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import { inject, onMounted, onUnmounted, ref } from 'vue'
import Message from 'element-ui/lib/message'
import 'element-ui/lib/theme-chalk/message.css'
import { useRouter } from 'vue-router/composables'

const $router = useRouter()

const injectEvent: any = inject('test')
const push = () => injectEvent('子传值')

const store = useCounterStore()
const { testNum } = storeToRefs(store)
const textColor = ref('#ff0000')
const tableData = ref<Array<any>>([])
const tableLoading = ref(false)

onMounted(() => {
  console.log('onMounted')
})

onUnmounted(() => {
  console.log('onUnmounted')
})

const changeStore = () => {
  Message.success('更改成功')
  store.setIsOk(!store.isOk)
  testNum.value++
}

const getTableData = () => {
  tableLoading.value = true
  const res = {
    "code": 0,
    "data": [
        {
            "date": "2022-01-04",
            "name": "James Garcia",
            "address": "湖北省 黄冈市 红安县"
        },
        {
            "date": "2011-04-03",
            "name": "Scott Garcia",
            "address": "广西壮族自治区 桂林市 恭城瑶族自治县"
        },
        {
            "date": "1997-02-07",
            "name": "Scott Martinez",
            "address": "山西省 晋城市 阳城县"
        },
        {
            "date": "1990-06-23",
            "name": "Jennifer Thompson",
            "address": "海外 海外 -"
        },
        {
            "date": "2016-12-22",
            "name": "Melissa Gonzalez",
            "address": "江苏省 镇江市 句容市"
        },
        {
            "date": "1993-08-24",
            "name": "Karen Rodriguez",
            "address": "贵州省 六盘水市 六枝特区"
        },
        {
            "date": "1971-09-30",
            "name": "Jennifer Lopez",
            "address": "甘肃省 武威市 古浪县"
        },
        {
            "date": "1998-07-15",
            "name": "Larry Wilson",
            "address": "湖北省 随州市 随县"
        },
        {
            "date": "2012-06-01",
            "name": "Jessica Harris",
            "address": "浙江省 宁波市 江东区"
        },
        {
            "date": "2011-06-04",
            "name": "Lisa Johnson",
            "address": "宁夏回族自治区 吴忠市 青铜峡市"
        }
    ]
  };
  tableData.value = res.data
  tableLoading.value = false
}

const toTestPage = () => {
  $router.push({
    name: 'TestPage',
    query: {
      data: 'aaa',
    },
  })
}

onMounted(() => {
  getTableData()
})
</script>
<style lang="scss" scoped>
.home-page {
  .test-text {
    color: v-bind(textColor);
  }
}
</style>
