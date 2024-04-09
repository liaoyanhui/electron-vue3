import {
	defineStore
} from 'pinia';
export const useDishStore = defineStore('dish', {
	state: () => ({
		dishCartInfo: {
			companyId: null,
			roomId: null,
			id:null
		},
		dishCartList: [
		]
	}),
	getters: {},
	actions: {
		addCart(item) {

			// this.dishCartList = 
			// this.collapse = !this.collapse;
		}
	}
});
// 遍历后台传来的路由字符串，转换为组件对象
function filterAddCartItem(item) {

}