import Vue from 'vue'
import Router from 'vue-router'


// All Components
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ConsolePage from '@/components/pages/Console'
import console_dashboard from '@/components/pages/_dashboard'
import console_product_list from '@/components/pages/_product'
import console_order_list from '@/components/pages/_order'
import console_coupon_list from '@/components/pages/_coupon'
import console_shop_testpage from '@/components/pages/_shop_testpage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        fullScreen:true,
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        fullScreen:true,
      }
    },
    {
      path: '/console',
      component: ConsolePage,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Console',
          component: console_dashboard,
          meta: { 
            requiresAuth: true,
            breadcrumb: [
              {
                text: '控制台',
                to: { name: 'Console' }
              }
            ]
           }
        },
        {
          path: 'products',
          name: 'Products',
          component: console_product_list,
          meta: { 
            requiresAuth: true,
            breadcrumb: [
              {
                text: '控制台',
                to: { name: 'Console' }
              },
              {
                text: '產品',
                to: { name: 'Products' }
              }
            ]
          }
        },
        {
          path: 'order',
          name: 'Order',
          component: console_order_list,
          meta: { 
            requiresAuth: true,
            breadcrumb: [
              {
                text: '控制台',
                to: { name: 'Console' }
              },
              {
                text: '訂單',
                to: { name: 'Order' }
              }
            ]
          }
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: console_coupon_list,
          meta: { 
            requiresAuth: true,
            breadcrumb: [
              {
                text: '控制台',
                to: { name: 'Console' }
              },
              {
                text: '優惠卷',
                to: { name: 'Coupon' }
              }
            ]
          }
        },
        {
          path: 'shop_testpage',
          name: 'Shop_TestPage',
          component: console_shop_testpage,
          meta: {
            requiresAuth: true,
            breadcrumb: [
              {
                text: '控制台',
                to: { name: 'Console' }
              },
              {
                text: '商品購買測試',
                to: { name: 'Shop_TestPage' }
              }
            ]
          }
        },
      ]
    }
  ]
})
