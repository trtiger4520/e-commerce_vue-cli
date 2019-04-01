<template>
    <div class="container">
        <h2>優惠卷</h2>
        <b-row class="mt-3">
            <b-col :lg="4" :order-lg="2">
                <b-card class="mb-3" title="添加新的優惠卷">
                    <b-form class="mt-3" @submit.prevent="submitCoupon" @reset.prevent="resetTempCoupon">
                        <label for="Coupon_Code">優惠碼</label>
                        <b-input id="Coupon_Code" class="mb-2" placeholder="" v-model="tempCoupon.code" :readonly="newCouponUploading"/>

                        <label for="Coupon_Title">名稱</label>
                        <b-input id="Coupon_Title" class="mb-2" placeholder="" v-model="tempCoupon.title" :readonly="newCouponUploading"/>

                        <label for="Coupon_Percent">打折</label>
                        <b-input-group append="%" class="mb-2">
                            <b-input id="Coupon_Percent" type="number" max="100" min="0" placeholder="0" v-model="tempCoupon.percent" :readonly="newCouponUploading"/>
                        </b-input-group>

                        <label for="Coupon_Due_Date">到期日</label>
                        <b-input id="Coupon_Due_Date" class="mb-2" type="date" max="2030-12-31" :min="getToDate()" v-model="tempCouponDate" :readonly="newCouponUploading"/>

                        <b-form-checkbox class="mb-2" :value="1" :unchecked-value="0" v-model="tempCoupon.is_enabled" :disabled="newCouponUploading">直接啟用</b-form-checkbox>

                        <div class="mt-3 text-center">
                            <b-button block type="submit" variant="primary" :disabled="newCouponUploading">
                                <b-spinner small label="Spinning" v-if="newCouponUploading"/>
                                <span v-else="">新增</span> 
                            </b-button>
                            <b-button type="reset" class="text-dark" variant="link" :disabled="newCouponUploading">清除</b-button>
                        </div>
                    </b-form>
                </b-card>
            </b-col>
            <b-col :lg="8" :order="1" class="vld-parent">
                <loading 
                    :active.sync="couponsLoading"
                    :is-full-page="false">
                    <span slot="after"> 正在載入中...</span>
                    <span slot="default">
                        <b-spinner type="grow" label="Loading..." />
                    </span>
                </loading>
                <b-card no-body class="mb-3" v-if="coupons && coupons.length > 0">
                    <b-list-group flush>
                        <b-list-group-item v-for="(coupon, index) in coupons" :key="index">
                            <b-row>
                                <b-col>
                                    <h5 :class="{ 'text-success': coupon.is_enabled }">{{ coupon.title }}</h5>
                                    <b-row wrap>
                                        <b-col :cols="6" :md="4"><small>折扣碼：{{ coupon.code }}</small></b-col>
                                        <b-col :cols="6" :md="4"><small>到期日：{{ toYYYYMMDD(new Date(coupon.due_date)) }}</small></b-col>
                                        <b-col :cols="6" :md="4"><small>折扣：{{ coupon.percent }}%</small></b-col>
                                        <b-col :cols="6" :md="4"><small>狀態：<span :class="{ 'text-success': coupon.is_enabled }">{{ coupon.is_enabled ? '已啟用' : '未啟用' }}</span></small></b-col>
                                    </b-row>
                                </b-col>
                                <b-col class="col-option-width d-flex flex-column justify-content-center">
                                    <b-button block variant="" v-b-modal.editCouponModal @click="setEditCouponData(coupon)"><font-awesome-icon fas icon="edit" /></b-button>
                                    <b-button block variant="link" class="text-danger" v-b-modal.delCouponModal @click="setDelCouponData(coupon)"><font-awesome-icon fas icon="trash-alt" /></b-button>
                                </b-col>
                            </b-row>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </b-col>
        </b-row>
        <b-modal id="editCouponModal" title="編輯優惠卷" @ok="editCoupon" ok-title="儲存" cancel-title="取消">
            <b-form class="mt-3">
                <label for="Coupon_Title">名稱</label>
                <b-input id="Coupon_Title" class="mb-2" placeholder="" v-model="editCouponData.title" :readonly="newCouponUploading"/>

                <label for="Coupon_Percent">打折</label>
                <b-input-group append="%" class="mb-2">
                    <b-input id="Coupon_Percent" type="number" max="100" min="0" placeholder="0" v-model="editCouponData.percent" :readonly="newCouponUploading"/>
                </b-input-group>

                <label for="Coupon_Due_Date">到期日</label>
                <b-input id="Coupon_Due_Date" class="mb-2" type="date" max="2030-12-31" :min="getToDate()" v-model="editCouponDataDate" :readonly="newCouponUploading"/>

                <b-form-checkbox class="mb-2" :value="1" :unchecked-value="0" v-model="editCouponData.is_enabled" :disabled="newCouponUploading">直接啟用</b-form-checkbox>
            </b-form>
        </b-modal>
        <b-modal id="delCouponModal" title="移除優惠卷" @ok="delCoupon" ok-title="刪除" ok-variant="danger" cancel-title="取消">
            <p>您確定要移除此優惠卷?</p>
            <h4>{{delCouponData.title}}</h4>
        </b-modal>
    </div>
</template>
<style lang="scss">
.col-option-width {
    flex:0 0 63.75px !important;
}
</style>

<script>
import _Methods from '@/_methods';
import { EventBus } from '@/_eventbus';
export default {
    name: 'Coupon',
    extends: _Methods,
    data() {
        return {
            coupons: [],
            couponsLoading: false,

            // 暫存優惠卷資料(新增)
            tempCoupon: {
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },
            // 預設列表
            defaultCoupon: {
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },
            // 暫存優惠卷時間格式(轉換用)
            tempCouponDate: '',
            // 再新增優惠卷時鎖定表單，防止再次編輯送出
            newCouponUploading: false,
            

            // 暫存優惠卷資料(編輯)
            editCouponData: {
                id: '',
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },
            // 暫存編輯優惠卷時間格式(轉換用)
            editCouponDataDate: '',
            // 預設列表
            defaultEditCouponData: {
                id: '',
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },

            delCouponData: {
                id: '',
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },
            delCouponDataDate: '',
            defaultDelCouponData: {
                id: '',
                title: '',
                code: '',
                percent: '',
                due_date: 0,
                is_enabled: 0
            },
        }
    },
    created() {
        this.getCouponList();
    },
    methods: {
        getCouponList(page = 1) {
            const vm = this;
            const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/coupons?page=${page}`;
            vm.couponsLoading = true;
            vm._getJson(url, true).then(res => {
                vm.coupons = res.coupons;
                vm.couponsLoading = false;
            });
        },
        setEditCouponData(data) {
            const vm = this;
            vm.editCouponData = Object.assign({}, data);
            vm.editCouponDataDate = vm.toYYYYMMDD(new Date(data.due_date));
        },
        setDelCouponData(data) {
            const vm = this;
            vm.delCouponData = Object.assign({}, data);
            vm.delCouponDataDate = vm.toYYYYMMDD(new Date(data.due_date));
        },

        addNewCoupon() {
            const vm = this;
            const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/coupon`;

            vm.newCouponUploading = true;
            vm.sendCoupon('post', url, vm.tempCoupon, function(success) {
                vm.tempCoupon = Object.assign({}, vm.defaultCoupon);
                vm.newCouponUploading = false;
            });
        },
        editCoupon() {
            const vm = this;
            const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/coupon/${vm.editCouponData.id}`;
            vm.sendCoupon('put', url, vm.editCouponData, function(success) {
                vm.editCouponData = Object.assign({}, vm.defaultEditCouponData);
            });
        },
        delCoupon() {
            const vm = this;
            const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/coupon/${vm.delCouponData.id}`;
            vm.sendCoupon('del', url, '', function(success) {
                vm.delCouponData = Object.assign({}, vm.defaultDelCouponData);
            });
        },
        async sendCoupon(method, url, data, collback) {
            const vm = this;
            let success = false;
            try {
                await vm[`_${method}Json`](url, data ? { data } : '', true).then( res => {
                    success = res.success;
                    if (res.success) {
                        EventBus.$emit('addalertmsg', res.message, 'success');
                    } else {
                        EventBus.$emit('addalertmsg', res.message, 'danger');
                    }
                });
            } catch (error) {
                success = false;
                EventBus.$emit('addalertmsg', '發生錯誤，請稍後在試。', 'danger');
            } finally {
                vm.getCouponList();
                if(collback) collback(success);
            }
        },
        resetTempCoupon() {
            this.tempCoupon = Object.assign({}, this.defaultCoupon);
        },

        getToDate() {
            return this.toYYYYMMDD(new Date());
        },

        toYYYYMMDD(date) {
            const mm = date.getMonth() + 1; // getMonth() is zero-based
            const dd = date.getDate();
            return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
        }
    },
    watch: {
        tempCouponDate: function() {
            const vm = this;
            vm.tempCoupon.due_date = new Date(vm.tempCouponDate).getTime();
        },
        editCouponDataDate: function() {
            const vm = this;
            vm.editCouponData.due_date = new Date(vm.editCouponDataDate).getTime();
        }
    }
}
</script>