<template>
    <div class="message-alert">
        <b-alert show dismissible fade v-for="(item, index) in messages" :key="index" :variant="item.variant">
            {{ item.message }}
        </b-alert>
    </div>
</template>

<script>
    import { EventBus } from '@/_eventbus';
    export default {
        data() {
            return {
                messages: [],
            };
        },
        methods: {
            updateMessage(message, variant) {
                const timestamp = Math.floor(new Date() / 1000);
                this.messages.push({
                    message,
                    variant,
                    timestamp,
                });
                this.removeMessageWithTiming(timestamp);
            },
            removeMessage(num) {
                this.messages.splice(num, 1);
            },
            removeMessageWithTiming(timestamp) {
                const vm = this;
                setTimeout(() => {
                    vm.messages.forEach((item, i) => {
                        if (item.timestamp === timestamp) {
                            vm.messages.splice(i, 1);
                        }
                    });
                }, 5000);
            },
        },
        created() {
            const vm = this;
            // 自定義名稱 'messsage:push'
            // message: 傳入參數
            // variant: 樣式，預設值為 warning

            EventBus.$on('addalertmsg', function(message, variant){
                vm.updateMessage(message, variant);
            });
            
        },
    };
</script>

<style scope>
    .message-alert {
        position: fixed;
        max-width: 50%;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1100;
    }
    .message-alert .alert {
        border-radius: 25px;
        box-shadow: 0 0 5px rgba(0,0,0, .36);
    }
</style>