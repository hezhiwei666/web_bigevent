$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '请输入1 - 6位的字符'
            }
        }
    })
    initUserInfo()


    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }


    //重置按钮绑定事件
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })


    //监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新个人资料成功')

                //调用父页面的方法，更新头像信息
                window.parent.getUserInfo()

            }
        })
    })

})