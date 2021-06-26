$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义时间美化的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        let y = padZero(dt.getFullYear())
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }




    //定义一个对象用来描述当前表格的信息
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initList()
    initCate()
        //获取文章的列表信息
    function initList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }

                //利用模板引擎渲染表格
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })

    }




    //获取文章分类信息
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败')
                }
                //渲染分类列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }


    //为筛选按钮所在表单绑定提交事件
    $('#search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initList()
    })


    //渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //首次不执行
                if (!first) {
                    initList()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]


        })
    }



    //为删除按钮绑定点击事件
    $('tbody').on('click', '#delete', function(e) {
        var len = $('#delete').length
        var id = $(this).attr('data-id')
        e.preventDefault()
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initList()
                }

            })

            layer.close(index);
        });
    })
})