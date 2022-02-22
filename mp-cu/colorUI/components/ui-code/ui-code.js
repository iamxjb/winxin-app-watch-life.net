import Prism from '../../../lib/prism'

Component({
    data: {
        nodes: [],
        rich: false
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        title: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        content: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'ui-BG'
        },
        text: {
            type: String,
            value: 'ui-TC-Main'
        },
        tag: {
            type: String,
            value: 'code'
        },
        lang: {
            type: String,
            value: 'null'
        },
        scroll: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        attached() {
            this.initCode();
        }
    },
    observers: {
        'content'(res) {
            this.initCode();
        }
    },
    methods: {
        initCode() {
            let langArr = [], nodes, content = this.data.content, lang = this.data.lang;
            if (this.data.tag === 'pre') {
                langArr = this.SupportList();
                if (langArr.indexOf(lang) === -1) {
                    nodes = content;
                } else {
                    nodes = Prism.highlight(content, Prism.languages[lang], lang);
                    this.setData({ rich: true })
                }
            }
            if (this.data.tag === 'code') {
                nodes = content;
            }
            this.setData({
                nodes: nodes
            })
        },
        SupportList() {
            let langs = [], i = 0;
            for (let language in Prism.languages) {
                if (Object.prototype.toString.call(Prism.languages[language]) !== '[object Function]') {
                    langs[i] = language;
                    i++;
                }
            }
            return langs;
        },
        copyCode() {
            wx.setClipboardData({
                data: this.data.content
            });
        },
    }
})