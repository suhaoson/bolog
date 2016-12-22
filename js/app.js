// 1.创建RouterApp 模块，引入ui.router路由模块
var routerApp = angular.module('routerApp',['ui.router','loginApp','pageList','xg.page','addCont'])
// 2.调用run方法，对项目进行一些初始化的操作
.run(function($rootScope,$state,$stateParams){
	$rootScope.state = $state;
	$rootScope.$stateParams = $stateParams;
})
// 3.调用config模块,对服务进行配置或者是对路由进行配置
.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/index');
	$stateProvider
	.state('index',{
		url:'/index',
		views:{
			'':{
				templateUrl:'tpls/home.html'
			},
			'main@index':{
				templateUrl:'tpls/login.html',
				controller:'loginCtrl'
			}
		}
	})
	.state('list',{
		url:'/list/{type:[0-9]{1,4}}',  //当前,我点击全部,前端，IOS,安卓,都是这个url路径状态
		views:{
			'':{
				templateUrl:'tpls/list.html'
			},
			"type@list":{
				templateUrl:'tpls/type.html',
				controller:'ListTypeCtrl'
			},
			"grid@list":{
				templateUrl:'tpls/grid.html',
				controller:'arcListCtrl'
			}
		}
	})
	.state('add',{
		url:'/add',
		views:{
			'':{
				templateUrl:'tpls/add.html'
			},
			'type@add':{
				templateUrl:'tpls/type.html',
				controller:'addConCtrl'
			},
			'addcon@add':{
				templateUrl:'tpls/addcon.html',
				controller:'addConCtrl'
			}
		}
	})
	.state('modify',{
		url:'/modify/:id',
		views:{
			'':{
				templateUrl:'tpls/modify.html'
			},
			'type@modify':{
				templateUrl:'tpls/type.html'

			},
			'modifycon@modity':{
				templateUrl:'tpls/modifycon.html'
			}
		}
	})
})