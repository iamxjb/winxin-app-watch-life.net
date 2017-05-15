var HOST_URI = 'https://www.watch-life.net/wp-json/wp/v2/';

var GET_PAGE='pages';


function obj2uri (obj) {
    return Object.keys(obj).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
}

module.exports = {
    // 获取文章列表数据
  getTopics: function (obj) {
    if (obj.category !=0)
    {
      return HOST_URI + 'posts?per_page=8&categories=' + obj.category+'&' + obj2uri(obj);
    }
    else
    {
      return HOST_URI + 'posts?per_page=8&' + obj2uri(obj);
    }
        
    },
    // 获取内容页数据
    getTopicByID: function (id, obj) {
      return HOST_URI + 'posts/' + id;
    },
    // 获取页面列表数据
    getPages: function (id, obj) {
        return HOST_URI +'pages';
    },    

    // 获取页面列表数据
    getPageByID: function (id, obj) {
      return HOST_URI + 'pages/' + id;
    },
    //获取分类列表
    getCategories: function (id, obj) {
      return HOST_URI + 'categories?per_page=50&orderby=count&order=desc'
    }
    
};