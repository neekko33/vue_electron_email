<template>
  <div class="hello">
    <h1>Welcome to the Vue-Electron-Email</h1>
    <p>
      Please enter the Content of your Email.
    </p>
    <a-input-search
      placeholder="Input Email account"
      enter-button="Add"
      v-model="account"
      size="default"
      style="width:50%;margin:0 auto;display:block;"
      @search="addTag"
    />
    <div class="tags">
      <a-tag
        v-for="(item,index) in tags"
        :key="index"
        closable
        style="margin-bottom:10px"
        @close="handleClose($event,item)"
        >{{ item }}</a-tag
      >
    </div>
    <a-button type="primary" style="font-weight:700;width:30%;margin-top:20px;" @click="handleClick"
      >Send</a-button
    >
  </div>
</template>
<script>
const { ipcRenderer } = window.require('electron');

export default {
  data() {
    return {
      account: '',
      tags: [],
    };
  },
  mounted() {
    ipcRenderer.on('finishSend', (event, arg) => {
      console.log(arg);
      this.$message.success('Send Successful!');
    });
  },
  methods: {
    addTag() {
      this.tags.push(this.account);
      this.account = '';
    },
    handleClose(e, i) {
      e.preventDefault();
      const tags = this.tags.filter((item) => item !== i);
      this.tags = tags;
    },
    handleClick() {
      ipcRenderer.send('sendEmail', this.tags);
    },
  },
};
</script>
<style scoped lang="less">
.tags {
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  height: 100px;
  text-align: center;
}
</style>
