
var loginApp = angular.module('loginApp',[])
.controller('loginCtrl',['$scope','$http','$location',function($scope,$http,$location){
	// 数据
	$scope.formData = {};
	// 发送的方法
	console.log(110)
	$scope.postForm = function(){
		// 1.formData添加一个属性,action='login'
		console.log($.param($scope.formData))
		$scope.formData.action = 'login';
		$http({
			method:'POST',
			url:"get.php",
			data:$.param($scope.formData),
			headers:{'Content-Type':'application/x-www-form-urlencoded'}
		}).success(function(data){
			
			if(!data.success){
				//当前登录失败
				if(!data.errors){
					//用户名密码为空的错误
					$scope.message = data.message
				}else{
					//用户名密码为空的错误
					$scope.errorsUsername = data.errors.username;
					$scope.errorsPassword = data.errors.password;
				}
			}else{
				console.log(110)
				window.location.href="#/list/0"
			}
		})
	}
}])

var pageList = angular.module('pageList',[])
pageList.controller('ListTypeCtrl',['$scope','$http',function($scope,$http){
	$http({
		method:'Get',
		url:'get.Php?action=get_arctype&where=reid=0'
	}).success(function(data){
		$scope.lists = data;
	}).error(function(err){
		console.log(err)
	})
}])
pageList.controller('arcListCtrl',function($scope,$location,$http){
	console.log($location);
	$scope.typeid = $location.path().replace('/list/','')
	console.log($scope.typeid)
	if($scope.typeid == 0){
		var get_total_url = 'get.php?action=get_total'  //获取所有文章
	}else{
		var get_total_url = 'get.php?action=get_total&where=typeid='+$scope.typeid  //获取某一个分类的文档
	}

	$scope.del = function(index,id){
		console.log(index+','+id)
		$http({
			method:'GET',
			url:'get.php?action=delete_article&id='+id
		}).success(function(data){
			console.log(data)
			if(data.code == 101){
				console.log(11111)
				$http({
					method:'GET',
					url:'get.php?action=get_article_title'
				}).success(function(data){
					console.log(data)
					$scope.lists = data
				})

			}
		})


	}

	//获取所对应的所有文章数目
	$http({
		method:'GET',
		url:get_total_url
	}).success(function(data){
		console.log(data)
		$scope.paginationConf.totalItems = data.total;  //获取当前文章总数量

	}).error(function(err){
		console.log(err)
	})
	$scope.paginationConf = {
		//当前的页数
		currentPage:1,
		//每页多少条
		itemsPerPage:5,
		// totalItems是文章的总数量
		pagesLength:5,
		// 可以自动更换的每页多少条
		prePageOptions:[10, 20, 30, 40, 50],
		rememberPerPage:'perpageItems',
		onChange:function(){
			// 判断分页是否是第一页
			if($scope.paginationConf.currentPage == 1){

				$scope.limit = 0;
			}else{
				// (当前页数 - 1 )* 每页多少条
				$scope.limit = $scope.paginationConf.currentPage * 
				$scope.paginationConf.itemsPerPage - $scope.paginationConf.itemsPerPage
			}
			// offset 当前的查询的偏移量
			// rows 当前的查询多少条
			// typeid 查询那个分类
			// orderField 根据那个字段进行排序
			// orderby 排序方式
		    if($scope.typeid == 0){
                $get_url = 'get.php?action=get_list&offset=' + $scope.limit + '&rows=' + $scope.paginationConf.itemsPerPage + '&orderField=id&orderBy=DESC';
            }else{
                $get_url='get.php?action=get_list&offset='+$scope.limit+'&rows='+$scope.paginationConf.itemsPerPage+'&where=typeid='+$scope.typeid+'&orderField=id&orderBy=DESC';
            }
            $http(
            	{method:'GET',
            	 url:$get_url
            	}).success(function(data){
            		console.log(data)
            		$scope.lists = data
            	}).error(function(err){
            		console.log(err)
            	})

		}
	}


})
var addCont = angular.module('addCont',[])
.controller('addConCtrl',['$scope','$http',function($scope,$http){
	// select所需的分类
	$http({
		method:"GET",
		url:'get.php?action=get_arctype&where=reid=0'
	}).success(function(data){
		$scope.lists = data
	}).error(function(err){
		console.log(err)
	})
	    $scope.formData = {};
    $scope.formData.action = 'add_article';
    $scope.postForm = function(){
        $http({
            method:'POSt',
            url:'get.php',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).success(function(data){
            $scope.errorBye = function(){
                $('#errorbox').fadeOut();
            }
            $scope.errorShow = function(){
                $('#errorbox').fadeIn();
            }
            if(!data.errors){
            	// 成功
            	$scope.meg_success = "插入成功,正在返回列表页面..."
            	$scope.meg_error = '';
            	setTimeout(function(){location.href='#/list/0'},1000)
            }else{
            	//失败
            	$scope.meg_success=''
            	var get_error = ''
            	if(data.errors.hasOwnProperty('title')){
            		get_error = data.errors.title
            	}
            	if(data.errors.hasOwnProperty('content')){
            		get_error = data.errors.content
            	}
            	if(data.errors.hasOwnProperty('typeid')){
            		get_error = data.errors.typeid
            	}

            	$scope.meg_error = get_error
            	console.log($scope.meg_error)
            }
        })
    }
}])

var modifyCont = angular.module('modifyCont',[])
.controller('modifyConCtrl',['$scope','$http','$stateParams',
	function($scope,$http,$stateParams){
		// 1.获取类别
		$http({
        	method:"GET",
        	url:'get.php?action=get_arctype&where=reid=0'
    	}).success(function(data){
        	$scope.types = data;
    	})
		
		// 2.读一条数据
		console.log($stateParams.id)// 当前路有中的参数id
		$http({
			method:'GET',
			url:"get.php?action=get_article&id="+$stateParams.id
		}).success(function(data){
			console.log(data)
			$scope.lists = data;
		}).error(function(err){
			console.log(err)
		})
		// 3.更新数据
		$scope.formData = {}
		$scope.postForm = function(){
			$scope.formData.action = 'update_article';
			$scope.formData.id = $stateParams.id
			$scope.formData.title = form.title.value
			$scope.formData.content = form.content.value
			$scope.formData.typeid = form.typeid.value
			console.log(form.typeid.value)
			$scope.formData.typeid = $('#typeid option:selected').val();
			console.log($scope.formData)
			$http({
				method:'POST',
				url:'get.php',
				data:$.param($scope.formData),
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log(data)
				if(data.code = 101){
					$scope.meg_success = '修改成功'
					$scope.meg_error = ''
					setTimeout(function(){location.href="#/list/0"},1000)
				}
				else{
					var meg_error = ''
					var meg_success = ''
					$scope.errorBye = function(){
						$('#errorbox').fadeIn()
					}
					$scope.errorBye = function(){
						$('#errorbox').fadeOut()
					}
					if(data.errors){
						if(data.errors.hasOwnProperty(title)){
							get_error = data.errors.title
						}
						if(data.errors.hasOwnProperty(content)){
							get_error = data.errors.content
						}
						$scope.meg_error = get_error
					}else{
						$scope.meg_error = '无任何修改'
					}
				}

			}).error(function(err){
				console.log(err)
			})
		}
}])

var showCont = angular.module('showCont',[])
.controller('showContCtrl',function($scope,$http,$stateParams){
	$http({
		method:'GET',
		url:"get.php?action=get_arctype&id="+$stateParams.id
	}).success(function(data){
		$scope.lists = data;
	}).error(function(err){
		console.log(err)
	})
})