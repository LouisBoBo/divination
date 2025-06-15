/**
 * 事件订阅发布
 * 
 var eventObj = this.$onfire.on('test_event', function(data) {
    console.log('this is a event 1');
});
var eventObj2 = this.$onfire.on('test_event', function(data) {
    console.log('this is a event 2');
});

// 触发事件
this.$onfire.fire('test_event', 'test_data');

// 取消绑定
this.$onfire.un(eventObj); // 取消绑定这个事件.
this.$onfire.un('test_event'); // 取消绑定所有的 `test_event`.

 */
import OnFire from 'onfire.js';
// 创建 onFire 事件实例
const onfire = new OnFire();

// 导出
export default onfire;



