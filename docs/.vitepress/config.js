import {resolve} from 'path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';

export default defineConfig({
    title: 'Youloge UI',
    description: 'GitHub 风格的 Vue3 组件库，基于 Unocss 构建',
    themeConfig: {
        nav: [
            { text: 'NPM', link: 'https://github.com/...' },
            { text: 'Github', link: 'https://github.com/...' }
        ],
        sidebar: [
            {
                text: '开始',
                items: [
                    { text: '快速开始', link: './started' },
                    { text: '更新日志', link: './changelog' }
                ]
            }, {
                text: '基础组件',
                base: '/basis/',
                items: [
                    { text: 'Button 按钮', link: '/button/' },
                    { text: 'Link 链接', link: '/link/' },
                ]
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present Youloge'
        },
        search:true
    },
    markdown: {
        config(md) {
            md.use(vitepressDemoPlugin);
        }
    },
    vite:{
        resolve:{
            alias:{
                '@lib':resolve(__dirname, './lib')
            }
        },
        plugins: [],
    }
})