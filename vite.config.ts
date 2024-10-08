import { UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import { ElementUiResolver } from 'unplugin-vue-components/resolvers'
import DefineOptions from 'unplugin-vue-define-options/vite'
import path from 'path'
import VueMacros from 'unplugin-vue-macros/vite'
import CONSTS from './src/utils/CONSTS'

export default ({ command: _ }: ConfigEnv): UserConfigExport => {
  return {
    base: `/${CONSTS.PREFIX_URL}/`,
    server: {
      host: true,
      port: 1350,
    },
    plugins: [
      VueMacros({
        plugins: {
          vue: vue(),
        },
      }),
      react(),
      DefineOptions(),
      // 代码降级
      legacy({
        targets: ['defaults', 'ie >= 11'],
        modernPolyfills: true,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      Components({
        resolvers: [ElementUiResolver()],
      }),
    ],
    build: {
      outDir: 'build',
      commonjsOptions: {
        include: /node_modules|lib/
      },
      /** 这个是配置入口js的输出目录? */
      assetsDir: './js',
      /** 分包后警告大小（未压缩大小） */
      chunkSizeWarningLimit: 1000,
      /** 
       * 启用/禁用 CSS 代码拆分
       * 除去element.css，其它所有css加起来gzip后大约是30kb（工作台加载20个css大小约是20kb）
       * 不拆分css能加快首次渲染速度，但css变化会导致hash变化，但是从缓存中读取多个css文件也比较耗时？
       */
      cssCodeSplit: true,
      rollupOptions: {
        plugins: [

        ],
        /** 打包排除这些依赖，保持import { xxx } from 'vue';这种导入 */
        // external: ['vue', 'vue-router', 'element-plus', '@micro-zoe/micro-app', 'element-plus/dist/index.css'],
        output: {
          format: 'esm', // 打包模式
          /**
           * 从对应网络路径中加载依赖
           * 对于external排除的依赖，直接从'vue'导入是无效的路径，所以需要配置对应资源路径，配置的路径是线上路径，不能使用相对路径
           */
          paths: {
            // 'vue': '/kchadmin/js/vue.cd730000_h.js',
            // 'vue-router': '/kchadmin/js/vue-router.4bcc0000_h.js',
            // '@micro-zoe/micro-app': '/kchadmin/js/micro-app.4e9a0000_h.js',
            // 'element-plus': '/kchadmin/js/element-plus.bd360000_h.js',
            // 'element-plus/dist/index.css': '/kchadmin/importElementCss.js',
          },
          /** 
           * 第三方库单独分包，顺序会影响加载(如element加载需要vue先加载)
           * ps: 使用的api不同，树摇后的hash也不同
           * 但由于项目后期使用到的api基本趋于稳定，所以hash也趋于稳定
           */
          manualChunks: {
            'element-ui': ['element-ui'],
            echarts: ['echarts', 'vue-echarts'],
            vue: ['vue'], // 82kb d929475c
            'vue-router': ['vue-router'], // 23kb e5da2ed4
            // element: ['element-plus'], // 748kb 0c0e8099
            axios: ['axios'], // 25kb b45127a5
            // 'micro-app': ['@micro-zoe/micro-app'],
          },
          /** 入口文件输出格式 */
          entryFileNames: 'js/[name].[hash]_h.js',
          /** js文件输出格式 */
          chunkFileNames: 'js/[name].[hash]_h.js',
          /** 资源文件输出格式 */
          assetFileNames: (assetInfo) => {
            /** 默认输出格式 */
            const defaultFormat = '[ext]/[name].[hash]_h.[ext]';
            /** 图片后缀 */
            const imageExts = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico'];
            /** 字体后缀 */
            const fontExts = ['ttf', 'woff', 'woff2'];
            /** 当前文件后缀 */
            const fileExt = assetInfo.name?.split('.').slice(-1)[0];
            /** 提取文件后缀异常处理 */
            if (!fileExt) {
              console.warn('>>> 文件后缀异常: ', assetInfo);
              return defaultFormat;
            }
            /** 图片资源 */
            if (imageExts.includes(fileExt)) {
              return 'img/[name].[hash]_h.[ext]';
            } else if (fontExts.includes(fileExt)) {
              return 'font/[name].[hash]_h.[ext]';
            }
            /** 其它资源 */
            return defaultFormat;
          },
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: path.resolve('src') + '/',
        },
      ],
    },
  }
}
