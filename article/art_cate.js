$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initAtrCateList()
        //获取图书列表
    function initAtrCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null;

    //为添加类别按钮绑定事件
    $('#addCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })



    //为确认添加绑定事件，注意页面一开始并没有确认添加按钮，需要委托
    $('body').on('submit', '#form_add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                layer.msg('添加分类成功');
                initAtrCateList()
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null;
    //为编辑按钮绑定事件
    $('tbody').on('click', '#editCate', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form_edit', res.data)
            }
        })
    })



    //为确认修改按钮委托绑定提交事件
    $('body').on('submit', '#form_edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功')
                layer.close(indexEdit)
                initAtrCateList()
            }
        })
    })


    //通过事件委托，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initAtrCateList()

                }
            })


        });

    })
})