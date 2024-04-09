const { session } = require("electron");

// 将响应头中的 set-cookie 转成 set() 方法需要的 details 对象
function getCookieDetails(cookie) {
  const details = {
    url: "https://example.com/",
  };
  cookie = cookie.split("; ");
  cookie.forEach((item, index) => {
    item = item.split("=");
    if (index === 0) {
      details.name = item[0];
      details.value = item[1];
    } else if (["domain", "path"].includes(item[0])) {
      details[item[0]] = item[1];
    } else if (item[0] == "expires") {
      details.expirationDate = new Date(item[1]).getTime() / 1000;
    } else if (item[0] == "HttpOnly") {
      details.httpOnly = true;
    }
    // HttpOnly 没有 item[1]  value 设为 true
  });
  return details;
}

module.exports = {
  // 是否是本站接口
  //TODO
  isWeapi: /^https:\/\/example\.com\/api\//,
  // 设置 cookies
  setCookies: function (cookies) {
    const setCookiePromise = [];

    cookies.forEach((cookie) => {
      const details = getCookieDetails(cookie);
      setCookiePromise.push(session.defaultSession.cookies.set(details));
    });

    return Promise.all(setCookiePromise);
  },

  // 获取 cookies，传给后端
  getCookies: async function () {
    const cookies = await session.defaultSession.cookies.get({
      domain: ".example.com"
    });
    const cookiesArr = [];
    cookies.forEach((cookie) => {
      cookiesArr.push(`${cookie.name}=${cookie.value}`);
    });
    return cookiesArr.join("; ");
  },
};
