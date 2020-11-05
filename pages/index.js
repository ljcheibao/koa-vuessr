const Vue = require("vue");
const VueSelectObejct = require("vuets-component-select");
const VueSelect = VueSelectObejct.VueSelect;
const VueOption = VueSelectObejct.VueOption;

module.exports = function createApp (context) {
  return new Vue({
    components: {
      VueSelect,
      VueOption
    },
    data() {
      return {
        visible: false,
        defaultValue: "2",
        data: [{
          value: "1",
          text: "2017-10-31"
        }, {
          value: "2",
          text: "2018-10-31"
        }],
        option: {
          title: "请选择时间",
          cancelText: "再想想",
        }
      }
    },
    methods: {
      confirmHandle(selectedValue) {
        alert(selectedValue);
      }
    }
  })
}