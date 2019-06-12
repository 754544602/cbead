/**
 * base_path : 接口访问路径
 * 
 * websit_path : 前端服务路径
 * 
 * is_test:正式开发时改成false
 * 
 * menu_data:一级菜单 数据
 * 
 * 
 * menu_data_two:二级菜单数据
 * 
 */

var $base_path = 'http://localhost:8081/cbead/';
var $cas_path = 'http://192.168.1.61:7216/cas/';
var $acl_path = 'http://192.168.1.61:7216/acl/';

var $yt_option = {
	/*项目路径*/
	base_path: $base_path,
	acl_path:$acl_path,
	websit_path: $base_path+'website/',//前台项目地址
	websit_index: $base_path+'website/index.html',//前端首页地址
	websit_index_base: $base_path+'website/view/index/allIndex.html',//前端首页地址
	indexUrl:$base_path,//导航首页跳转地址
	logoutUrl:$base_path+'api/index/toLogout?logoutUrl='+$cas_path+'logout?service='+$base_path+'website/index.html',
//	logoutUrl:'http://login.cbead.cn/oauth/sso-logout?accessToken=',
//	logoutUrl:$base_path+'api/index/toOut',
//	menu_path:$base_path+'website/resources/js/common/menuDataTest.json',
	menu_path:$base_path+'api/index/getSystemMenusToTreeMap',//左侧菜单获取地址
	version_code:'2017121501',//资源文件版本号
	parent_action_path:$base_path+'website/parentAction.html',//父级页面地址
	is_test:false,
	is_cas:false,
	longitude:121.53040099215,
	latitude:38.890758561379
};