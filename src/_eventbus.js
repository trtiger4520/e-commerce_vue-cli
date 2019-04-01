import Vue from 'vue';
export const EventBus = new Vue();

// Ex.
//     EventBus.$on( name: String , coll: Function );
//     EventBus.$emit( name: String , ...args[] );
// 

// #1
// name: 'addalertmsg'
// description: 新增 alert 訊息。
// parameter: message, variant
//   message --> 要顯示的訊息
//   variant --> alert樣式 (primary, secondary, success, danger, warning, info, light, dark)

