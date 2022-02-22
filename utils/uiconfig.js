//框架核心配置
import ColorUI from '../mp-cu/main'
export const colorUI = new ColorUI({
    config: {
        theme: 'auto',
        main: 'blue',
        footer: false,
        text: 1,    tabBar: [{
            title: '首页',
            icon: 'cicon-home-sm-o',
            curIcon: 'cicon-home-line',
            url: '/pages/index/index',
            type: 'tab'
        },
        {
            title: '分类',
            icon: 'cicon-discover-o',
            curIcon: 'cicon-discover',
            url: '/pages/topic/topic',
            type: 'tab'
        },
        {
            title: '排行',
            icon: 'cicon-upstage-o',
            curIcon: 'cicon-upstage',
            url: '/pages/hot/hot',
            type: 'tab'
        }, 
        {
            title: '我的',
            icon: 'cicon-my-o',
            curIcon: 'cicon-my',
            url: '/pages/my/my',
            type: 'tab'
        }],
    }
})