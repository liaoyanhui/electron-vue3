<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="logo"></div>
      <div class="pc" v-if="loginType == 1" @click="loginTypeChange(2)"></div>
      <div class="ecode" v-else @click="loginTypeChange(1)"></div>
      <h3 class="title">欢迎登录K家e联</h3>
      <div v-if="loginType == 1" class="text-center">
        <div class="ecode-img">
          <img v-if='qrCodeSrc' :src="qrCodeSrc" width="100%" height="100%" />
          <div v-else></div>
          <div class="ecode-warp" v-if="qrCodeStatus == 1 || qrCodeStatus == 3">
            <div class="img-success" v-if="qrCodeStatus == 1"></div>
            <div class="img-fail" v-if="qrCodeStatus == 3"></div>
            <div class="mt-20">{{ qrCodeStatus== 1 ?'扫码成功!' : '二维码过期' }}</div>
          </div>
        </div>
        <div  v-if="qrCodeStatus == 1" class="color-black fs-14 mt-2"><span class="color-green pointer" @click="getLoginQRCode">重新扫码</span></div>
        <div   v-else-if="qrCodeStatus == 3" class="color-black fs-14 mt-2">请<span class="color-green mx-4 pointer" @click="getLoginQRCode">刷新</span>重试</div>
        <div v-else class="color-black">请打开<span class="color-green">K家e联App</span>扫码登录</div>
      </div>
      <div v-else class="mt-50">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
            <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top:26px">
          <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
            @keyup.enter="handleLogin">
            <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%"
            @keyup.enter="handleLogin">
            <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>
        <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;margin-bottom: 0;margin-top:32px">
          <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script setup>
// import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/user'
import { loginQRCode, loginKeUserStatus } from '@/api/login'
import QRCode from 'qrcode';
const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const loginType = ref(1)
const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});


const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const qrCodeSrc = ref('');
const qrCodeStatus = ref(0)
const qrData = ref({
  encryptVal: '',
  expiresDate: ''
})

let intervalId = null;
onMounted(() => {
  getLoginQRCode()
});


watch(route, (newRoute) => {
  redirect.value ='/redirect' + newRoute.query?.redirect ??''
  console.log('newRoute.query && newRoute.query.redirect;',redirect.value)
}, { immediate: true });

const getLoginQRCode = () => {
  if (intervalId) {
    clearTimeout(intervalId);
  }
  loginQRCode().then(async res => {
    qrData.value = {
      expiresDate: res.expiresDate,
      encryptVal: res.encrypt
    }
    const qrCodeDataUrl = await QRCode.toDataURL(res.encrypt);
    qrCodeSrc.value = qrCodeDataUrl;
    getLoginKeUserStatus(res.expiresDate)
  }).catch(async () => {
    const qrCodeDataUrl = await QRCode.toDataURL('没有二维码');
    qrCodeSrc.value = qrCodeDataUrl;
    qrCodeStatus.value=3
  })
}

const getLoginKeUserStatus = (expiresDate) => {
  let { encryptVal } = qrData.value
  if (Date.now() < qrData.value.expiresDate) {
    loginKeUserStatus({ encryptVal }).then(res => {
      let { status, token = '' } = res
      if (status == 0 || status === 1) {  //扫码成功
        intervalId = setTimeout(() => {
          getLoginKeUserStatus(expiresDate)
        },1000)
      } else if (status == 2) { //登录成功
        localStorage.setItem('token', token)
        clearTimeout(intervalId);
        loginSuccessHandle()
      } else if (status == 3) { //二维码过期
      
        clearTimeout(intervalId);
      }
      qrCodeStatus.value = status


    }).catch(() => {
      qrCodeStatus.value = 3
      console.log('qrCodeStatus', qrCodeStatus.value)
      clearTimeout(intervalId);
    })
  } else {
    
  }

}


const loginTypeChange = (type) => {

  if (type == 1) {
    getLoginQRCode()
  } else {
    clearTimeout(intervalId);
  }
  loginType.value =type
}

const loginSuccessHandle = () => {
  window.mainApi?.ipcRenderer.send('getDictJson')
    const query = route.query;
    const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
      if (cur !== "redirect") {
        acc[cur] = query[cur];
      }
      return acc;
    }, {});
    router.push({ path: redirect.value, query: otherQueryParams });
}




function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;     
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        // 获取本地缓存数据
        loginSuccessHandle()
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        // if (captchaEnabled.value) {
        //   getCode();
        // }
      });
    }
  });
}



function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

onUnmounted(() => {
  clearTimeout(intervalId); // 组件卸载时清除定时器
});
// getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://image.hzxyle.com/cbank/image/100/dish/9829c0c9c37d4c7598ac22b671eb4f40.png");
  background-size: cover;
}

.title {
  margin: 0px auto 0px auto;
  text-align: center;
  font-family: FZLTZHJW--GB1, FZLTZHJW--GB1;
  color: #2C2C2C;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 44px 75px 55px 75px;
  box-sizing: border-box;
  position: relative;

  .ecode-img {
    width: 206px;
    height: 206px;
    border-radius: 10px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;

    .ecode-warp {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .9);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #000;
      .img-success{
        width: 80px;
        height: 80px;
        background-image: url("./img/success.png");
        background-size: 100%;
      }
      .img-fail{
        width: 80px;
        height: 80px;
        background-image: url("./img/ecode-fail.png");
        background-size: 100%;
      }
    }
  }

  .ecode {
    width: 58px;
    height: 58px;
    background-image: url("./img/ecode.png");
    background-size: 100%;
    position: absolute;
    right: 10px;
    top: 10px;

    &:hover {
      background-image: url("./img/ecode-active.png");
      background-size: 100%;
    }
  }

  .pc {
    width: 58px;
    height: 58px;
    background-image: url("./img/pc.png");
    background-size: 100%;
    position: absolute;
    right: 10px;
    top: 10px;

    &:hover {
      background-image: url("./img/pc-active.png");
      background-size: 100%;
    }
  }

  .logo {
    width: 80px;
    height: 80px;
    background-image: url("./img/logo.png");
    background-size: cover;
    margin: 0 auto 20px;
  }

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
