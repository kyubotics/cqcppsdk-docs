module.exports = {
    title: 'CoolQ C++ SDK',
    description: '使用现代 C++ 开发酷Q插件',
    markdown: {
        // lineNumbers: true,
    },
    head: [
        ['link', { rel: 'icon', href: `/logo.png` }],
        ['meta', { name: 'theme-color', content: '#000000' }],
    ],
    plugins: {
        'container': {
            type: 'tree',
            before: '<pre class="tree-container"><code>',
            after: '</code></pre>'
        },
        '@vuepress/google-analytics': {
            'ga': 'UA-115509121-3'
        },
        '@vuepress/back-to-top': true,
        '@vuepress/medium-zoom': true,
    },
    themeConfig: {
        logo: '/logo.png',
        repo: 'cqmoe/cqcppsdk',
        lastUpdated: '上次更新',
        nav: [
            { text: '主页', link: '/' },
            { text: '指南', link: '/guide/' },
            { text: 'Dolores', link: '/dolores/' },
            { text: '术语表', link: '/glossary.html' },
            { text: '更新日志', link: '/changelog.html' },
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '',
                        'before-getting-started',
                        'getting-started',
                        'getting-started-advanced',
                        'macros',
                        'events',
                        'lifecycle-events',
                        'apis',
                        'useful-modules',
                        'app-json',
                        'third-party-libs',
                        'windows-free',
                        'packaging',
                        'update-sdk',
                    ]
                }
            ],
            '/dolores/': [
                {
                    title: 'Dolores',
                    collapsable: false,
                    children: [
                        '',
                    ]
                }
            ],
        },
    }
}