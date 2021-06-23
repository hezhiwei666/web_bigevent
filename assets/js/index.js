$(function() {
    var layer = layui.layer
        //调用 getUserInfo 用户信息
    getUserInfo()

    //退出
    $('#btnLogout').on('click', function() {
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            console.log('ok');
            //清空本地存储
            localStorage.removeItem('token');
            //重新跳转回登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调用renderAvatar函数
            renderAvatar(res.data)

        }
    })
}


//渲染用户头像
function renderAvatar(user) {
    //1. 获取用户的昵称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本图像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}