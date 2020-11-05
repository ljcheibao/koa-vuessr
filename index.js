const Koa = require('koa');
const app = new Koa();
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const VueServerRender = require('vue-server-renderer');
//const renderer = require('vue-server-renderer').createRenderer();
const createBundleRenderer = VueServerRender.createBundleRenderer;
const router = require('koa-router')();
app.use(require('koa-static')(path.resolve(__dirname, "./components/vue-component-select/dist")));
//const vm = require("./pages/index");
// const serverBundle = require("./components/vue-component-select/dist/vue-ssr-server-bundle.json");
//const serverBundle = require("./components/vue-component-select/dist/index.js");

const createApp = require('./components/vue-component-select/build/index.js');

let serverBundleFile = `${process.cwd()}/components/vue-component-select/build/index.js`;

let serverBundleCode = fs.readFileSync(serverBundleFile, "utf8");

const tpl = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");
var tt = new Date().getTime();

let data = {
  visible: false,
  defaultValue: "2",
  data: [{
    value: "1",
    text: "2019-10-31"
  }, {
    value: "2",
    text: "2020-10-31"
  }],
  option: {
    title: "请选择时间",
    cancelText: "再想想",
  }
};

// response
router.get("/index", async ctx => {
  let html = await renderHtml();
  html = `
          <div class="freedom-vue-component-wrapper">
            <input class="schema-data-vue-component-select" type="hidden" value="${encodeURIComponent(JSON.stringify(data))}"/>
            ${html}
            <link rel="stylesheet" type="text/css" href="/css/index.css?tt=${tt}" />
            <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js?tt=${tt}"></script>
            <script src="/index.js?tt=${tt}"></script>
          </div>
  `
  ctx.body = html;
});

app.use(router.routes(), router.allowedMethods());


function renderHtml() {
  return new Promise(function (resolve, reject) {
    // const renderer = createBundleRenderer(serverBundle, {
    //   runInNewContext: false,
    //   template:tpl,
    //   basedir: path.resolve(__dirname,'./components/vue-component-select/dist')
    // });
    // renderer.renderToString({}, (err, html) => {
    //   resolve(html);
    // });

    const renderer = VueServerRender.createRenderer({
      template: tpl
    });
    let wrapper = `
        ((module, require) => {
            return ${serverBundleCode}
        })
    `;
    let createApp = vm.runInThisContext(wrapper)(module, require);
    let context = data;
    var app = createApp(context);
    renderer.renderToString(app, (err, html) => {
      console.log(html);
      createApp = null;
      app = null;
      resolve(html);
    });
  });
};

app.listen(3000);




// const { createBundleRenderer } = require('vue-server-renderer')

// const renderer = createBundleRenderer(serverBundle, {
//   runInNewContext: false, // 推荐
//   template, // （可选）页面模板
//   clientManifest // （可选）客户端构建 manifest
// })

// // 在服务器处理函数中……
// server.get('*', (req, res) => {
//   const context = { url: req.url }
//   // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
//   // 现在我们的服务器与应用程序已经解耦！
//   renderer.renderToString(context, (err, html) => {
//     // 处理异常……
//     res.end(html)
//   })
// })