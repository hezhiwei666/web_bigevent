$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate()
        // 初始化富文本编辑器
    initEditor()
        //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //利用模板引擎，动态渲染页面
                var htmlStr = template('tpl-cate ', res)
                $('select').html(htmlStr)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击选择封面按钮事件
    $('#sel').on('click', function(e) {
        e.preventDefault()
        $('#coverFile').click()
    })


    //监听文件选择框的change事件
    $('#coverFile').on('change', function(e) {
        e.preventDefault()
        var files = e.target.files;
        if (files.length === 0) {
            return
        }

        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })



    //文章发布状态
    var art_state = '已发布';

    //为存为草稿按钮绑定点击事件
    $('#bntSave2').on('click', function() {
        art_state = '草稿';
    })


    //监听表单的submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        //将裁减后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })


    //发请求发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})