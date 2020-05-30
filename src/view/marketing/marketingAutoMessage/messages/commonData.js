export default function(msgType) {
  /**
   * msgType
   * 3 发货提醒
   * 4 催付提醒
   */
  return {
    payTimeData:[
      {label:'5分钟',value:5},
      {label:'10分钟',value:10},
      {label:'15分钟',value:15},
      {label:'20分钟',value:20},
      {label:'30分钟',value:30},
      {label:'1小时',value:60},
      {label:'2小时',value:120},
      {label:'5小时',value:300},
      {label:'10小时',value:600},
      {label:'15小时',value:900},
      {label:'20小时',value:1200},
    ],
    sendTimeData:[
      {label:'08:00',value:'08:00:00'},
      {label:'09:00',value:'09:00:00'},
      {label:'10:00',value:'10:00:00'},
      {label:'11:00',value:'11:00:00'},
      {label:'12:00',value:'12:00:00'},
      {label:'13:00',value:'13:00:00'},
      {label:'14:00',value:'14:00:00'},
      {label:'15:00',value:'15:00:00'},
      {label:'16:00',value:'16:00:00'},
      {label:'17:00',value:'17:00:00'},
      {label:'18:00',value:'18:00:00'},
      {label:'19:00',value:'19:00:00'},
      {label:'20:00',value:'20:00:00'},
      {label:'21:00',value:'21:00:00'},
      {label:'22:00',value:'22:00:00'},
    ]
  }
}
