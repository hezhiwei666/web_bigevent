$(function() {
    //点击去注册账号
    $('#link_reg').on('click', function() {
        $('.login-log').hide();
        $('.login-reg').show();
    })

    //点击去登录
    $('#link_log').on('click', function() {
        $('.login-log').show();
        $('.login-reg').hide();
    })


    //从 layui 中获取 form 对象
    var form = layui.form;

    var layer = layui.layer;
    //通过 form.verify()方法自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            //拿到密码框中的内容，用密码框中的内容和value比较，若不一样，则弹出对话框
            var pwd = $('.login-reg   [name=password]').val();
            if (pwd !== value) {
                return '两次输入的密码不一致！';
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')

            //清空注册内容
            $('#form_reg [name=username]').val('');
            $('#form_reg [name=password]').val('');
            $('#form_reg [name=repassword]').val('');
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户名或密码错误，请重新登录')
                }
                layer.msg('登录成功');
                //将stoken的值存储到本地
                localStorage.setItem('token', res.token);
                //跳转到主页
                location.href = '/index.html'
            }
        })
    })
})