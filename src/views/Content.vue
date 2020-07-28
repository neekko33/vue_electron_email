<template>
  <div class="hello">
    <h1>Welcome to the Vue-Electron-Email</h1>
    <p>
      Please enter the Content of your Email.
    </p>
    <a-textarea
      v-model="content"
      placeholder="Input the content of your Email here."
      :auto-size="{ minRows: 7, maxRows: 7 }"
      style="width:70%;margin:0 auto;display:block"
    />
    <a-button type="primary" style="font-weight:700;width:30%;margin-top:20px;" @click="handleClick"
      >Next</a-button
    >
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron');

export default {
  name: 'content',
  data() {
    return {
      content: '',
    };
  },
  mounted() {
    ipcRenderer.on('finishContent', () => {
      this.$router.push({ name: 'Send' });
    });
  },
  methods: {
    handleClick() {
      ipcRenderer.send('emailContent', this.content);
    },
  },
};
</script>

<style></style>
