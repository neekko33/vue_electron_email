<template>
  <div class="hello">
    <h1>Welcome to the Vue-Electron-Email</h1>
    <p>
      Please enter the infomation of your Email account.
    </p>
    <a-form-model :form="form" :wrapper-col="{ span: 12 }">
      <a-form-model-item>
        <a-input v-model="form.nickName" placeholder="Please input your nickName" />
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="form.account" placeholder="Please input your account" />
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="form.password" type="password" placeholder="Please input your password" />
      </a-form-model-item>
      <a-form-item :wrapper-col="{ span: 12 }">
        <a-button
          type="primary"
          @click="handleSubmit"
          style="font-weight:700;width:30%;margin-top:20px;"
        >
          Confirm
        </a-button>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = window.require('electron');

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      form: {
        nickName: '',
        account: '',
        password: '',
        service: 'QQ',
      },
    };
  },
  mounted() {
    ipcRenderer.on('finishCreate', () => {
      this.$router.push({ name: 'Content' });
    });
  },
  methods: {
    handleSubmit() {
      ipcRenderer.send('emailInfo', this.form);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.ant-form-item {
  display: flex;
  justify-content: center;
}
</style>
