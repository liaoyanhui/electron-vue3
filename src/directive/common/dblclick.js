/*
 * @Description: 
 * @Author: pgm
 * @Date: 2024-03-02 20:10:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-02 20:16:03
 * @FilePath: /cbank-client/src/directive/common/dblclick.js
 */

export default {
  beforeMount(el, binding) {
    let clicked = false;
    let timeout;
    el.addEventListener('click', () => {
      const value = binding.value.value
      if (!clicked) {
        clicked = true;
        timeout = setTimeout(() => {
          clicked = false;
          binding.value.click(value ? value : '')
        }, 300); // 设置一个延迟，区分单击和双击
      } else {
        clearTimeout(timeout);
        clicked = false;
        binding.value.dblclick(value ? value : '')
      }
    });
  }
}