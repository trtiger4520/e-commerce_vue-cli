<template>
    <div class="container vld-parent">
        <loading 
            :active.sync="productsIsLoading"
            :is-full-page="false">
            <span slot="after"> 正在載入中...</span>
            <span slot="default">
                <b-spinner type="grow" label="Loading..." />
            </span>
        </loading>
        <header class="clearfix">
            <h2 class="d-inline">產品</h2>
            <b-button class="float-right" variant="success" @click="newProduct" v-b-modal.ProductModal>新增產品</b-button>
        </header>
        <div v-if="products.length" class="py-3">
            <b-pagination
                class="justify-content-center"
                v-model="pagination.current_page"
                :total-rows="pagination.total_pages * per_pages"
                :per-page="per_pages"
                :limit="5" />

            <div class="px-md-2 pb-3">
                <b-row class="border-bottom">
                    <b-col :cols="2" :sm="1" class="py-2"></b-col>
                    <b-col :cols="6" :sm="4" :md="5" :lg="4" class="py-2 border-right">標題</b-col>
                    <b-col :cols="3" :sm="3" :md="2" :lg="2" class="py-2 text-right border-right d-none d-md-block">原價</b-col>
                    <b-col :cols="3" :sm="3" :md="2" :lg="2" class="py-2 text-right border-right d-none d-sm-block">售價</b-col>
                    <b-col :cols="4" :sm="3" :md="2" :lg="3" class="py-2 text-center">編輯</b-col>
                </b-row>
                <b-row 
                    v-for="(product, index) in products" 
                    :key="index"
                    >
                    <b-col :cols="2" :sm="1" class="text-success"><font-awesome-icon fas icon="eye" class="my-2" v-if="product.is_enabled" /></b-col>
                    <b-col :cols="6" :sm="4" :md="5" :lg="4" class="py-2 border-bottom border-right text-ellipsis">{{ product.title }}</b-col>
                    <b-col :cols="3" :sm="3" :md="2" :lg="2" class="py-2 border-bottom border-right text-ellipsis text-right d-none d-md-block">{{ product.origin_price | currency }}</b-col>
                    <b-col :cols="3" :sm="3" :md="2" :lg="2" class="py-2 border-bottom border-right text-ellipsis text-right d-none d-sm-block">{{ product.price | currency }}</b-col>
                    <b-col :cols="4" :sm="3" :md="2" :lg="3" class="py-2 border-bottom">
                        <div class="d-flex justify-content-around">
                            <b-button size="sm" variant="dark" @click="editProduct(product)" v-b-modal.ProductModal>
                                <font-awesome-icon fas icon="edit" />
                                <span class="d-none d-lg-inline">編輯</span>
                            </b-button>
                            <b-button size="sm" class="text-danger" @click="delProduct(product)" variant="link" v-b-modal.DeleteProductModal>
                                <font-awesome-icon fas icon="trash-alt" />
                                <span class="d-none d-lg-inline">刪除</span>
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </div>
            <b-pagination
                class="justify-content-center"
                v-model="pagination.current_page"
                :total-rows="pagination.total_pages * per_pages"
                :per-page="per_pages"
                :limit="5" />
        </div>
        <div v-else class="py-5">
            <h4 v-if="!productsIsLoading" class="text-black-50">目前還沒有任何產品喔！</h4>
        </div>

        <b-modal id="ProductModal" size="lg" hide-header no-close-on-backdrop @ok="updateProduct">
            <b-alert 
                :show="product_modal_msg.status" 
                :variant="product_modal_msg.variant" 
                fade>
                {{ product_modal_msg.message }}
            </b-alert>
            <b-row>
                <b-col lg="4" order="1" order-lg="0">
                    <div class="form-group">
                        <label for="image">輸入圖片網址</label>
                        <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結"
                            v-model="tempProduct.imageUrl">
                    </div>
                    <div class="form-group">
                        <label for="customFile">
                            或 上傳圖片
                            <font-awesome-icon v-if="upload_image_status" fas pulse icon="spinner" />
                        </label>
                        <input type="file" id="customFile" class="form-control" ref="files" @change="updateImgFile">
                    </div>
                    <img v-if="tempProduct.imageUrl" :src="tempProduct.imageUrl" class="img-fluid" :alt="tempProduct.title">
                </b-col>
                <b-col lg="8">
                    <div class="form-group">
                      <label for="title">標題</label>
                      <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題"
                        v-model="tempProduct.title">
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="category">分類</label>
                        <input type="text" class="form-control" id="category"
                          placeholder="請輸入分類"
                          v-model="tempProduct.category">
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">單位</label>
                        <input type="unit" class="form-control" id="unit"
                          placeholder="請輸入單位"
                          v-model="tempProduct.unit">
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                      <label for="origin_price">原價</label>
                        <input type="number" class="form-control" id="origin_price"
                          placeholder="請輸入原價"
                          v-model="tempProduct.origin_price">
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">售價</label>
                        <input type="number" class="form-control" id="price"
                          placeholder="請輸入售價"
                          v-model="tempProduct.price">
                      </div>
                    </div>
                    <hr>

                    <div class="form-group">
                      <label for="description">產品描述</label>
                      <textarea type="text" class="form-control" id="description"
                        placeholder="請輸入產品描述"
                        v-model="tempProduct.description"></textarea>
                    </div>
                    <div class="form-group">
                      <label for="content">說明內容</label>
                      <textarea type="text" class="form-control" id="content"
                        placeholder="請輸入產品說明內容"
                        v-model="tempProduct.content"></textarea>
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                          id="is_enabled"
                          v-model="tempProduct.is_enabled"
                          :true-value="1"
                          :false-value="0">
                        <label class="form-check-label" for="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                </b-col>
            </b-row>
        </b-modal>
        <b-modal 
            id="DeleteProductModal" 
            title="您確定要刪除此產品嗎?" 
            @ok="destroyProduct"
            ok-variant="danger"
            ok-title="是，我要移除"
            cancel-title="取消">
            <div class="text-center">
                <h2>{{ tempProduct.title }}</h2>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import _Methods from '@/_methods';
    import { EventBus } from '@/_eventbus';

    export default {
        extends: _Methods,
        data() {
            return {

                // 產品清單
                products: [],

                // 緩衝
                list_buffer: {
                    pre: [],
                    next: []
                },

                
                // 每頁顯示數量
                per_pages: 10,
                // 頁數
                pagination: {
                    category: null,
                    current_page: 1,
                    has_next: false,
                    has_pre: false,
                    total_pages: 1
                },

                // 產品清單正在讀取
                productsIsLoading: false,

                // 產品暫存資訊
                tempProduct: {
                    title: "",
                    category: "",
                    origin_price: 0,
                    price: 0,
                    unit: "",
                    image: "",
                    description: "",
                    content: "",
                    is_enabled: 0,
                    imageUrl: "",
                },  

                // 預設產品資訊
                defautProductObj: {
                    title: "",
                    category: "",
                    origin_price: 0,
                    price: 0,
                    unit: "",
                    image: "",
                    description: "",
                    content: "",
                    is_enabled: 0,
                    imageUrl: "",
                },

                // 是否是建立新的產品 (改變 ProductModal 呈現方式)
                is_new_product: true,

                // ProductModal 狀態訊息
                product_modal_msg: {
                    status: false,
                    message: "",
                    variant: "danger"
                },

                // 是否正在上傳圖片
                upload_image_status: false
            }
        },
        created() {
            this.getProducts()
        },
        methods: {

            // 圖片上傳事件 (input[type=file] on change)
            updateImgFile() {
                const files = this.$refs.files.files[0];
                const formData = new FormData();
                formData.append('file-to-upload', files);
                const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/upload`;
                this.upload_image_status = true;
                this._postFile(url, formData, true).then(res => {
                    if (res.success) {
                        this.tempProduct.imageUrl = res.imageUrl;
                        this.product_modal_msg.status = true;
                        this.product_modal_msg.message = '檔案上傳成功';
                        this.product_modal_msg.variant = 'success';
                    } else {
                        this.product_modal_msg.status = true;
                        this.product_modal_msg.message = '檔案上傳失敗';
                        this.product_modal_msg.variant = 'danger';
                    }
                    this.upload_image_status = false;
                });
            },

            // 取得產品清單
            getProducts(page = 1) {
                this.productsIsLoading = true;
                
                this.getProductList(page, true).then(data => {
                    if (data.success) {
                        this.products = data.products ? data.products :  [];
                        this.pagination = data.pagination ? data.pagination : [];
                    } else {
                        EventBus.$emit('addalertmsg', data.message, 'danger')
                    }

                    this.productsIsLoading = false;
                });
            },

            newProduct() {
                this.is_new_product = true;
                this.tempProduct = Object.assign({}, this.defautProductObj);
            },
            editProduct(product) {
                this.is_new_product = false;
                this.tempProduct = Object.assign({}, product);
            },
            delProduct(product) {
                this.tempProduct = Object.assign({}, product);
            },

            updateProduct(e) {
                const hostpath = process.env.HOSTPATH;
                const apipath = process.env.APIPATH;
                const is_new = this.is_new_product;
                const url = is_new ? 
                `${hostpath}/api/${apipath}/admin/product`:
                `${hostpath}/api/${apipath}/admin/product/${this.tempProduct.id}`;
                const method = is_new ? '_postJson' : '_putJson';
                const postData = { data: this.tempProduct };
                this[method](url, postData, true).then(res => {
                    if (res.success) {
                        this.getProducts();
                        EventBus.$emit('addalertmsg', res.message, 'success');
                    } else {
                        e.preventDefault();
                        this.product_modal_msg.status = true;
                        this.product_modal_msg.message = res.message;
                        this.product_modal_msg.variant = 'danger';
                    }
                    
                });
            },

            destroyProduct(id) {
                const url = `${process.env.HOSTPATH}/api/${process.env.APIPATH}/admin/product/${this.tempProduct.id}`;
                this._delJson(url, true).then(res => {
                    if (res.success) {
                        this.getProducts();
                        EventBus.$emit('addalertmsg', res.message, 'warning');
                    } else {
                        e.preventDefault();
                        EventBus.$emit('addalertmsg', res.message, 'danger');
                    }
                });
            }

        },
        watch: {
            'pagination.current_page': function(newPage, beforePage) {
                newPage >= 1 && newPage <= this.pagination.total_pages && this.getProducts(newPage);
            } 
        }
    }
</script>