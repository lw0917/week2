require(['./js/main.js'],function(){
    require(['jquery','bscroll','flex'],function($,bscroll){
        var scroll=new bscroll('section',{
            probeType:2,
            click:true
        });
        var page=1,
            size=10,
            val='',
            total=0;
        init();
        function init(){
           
            loadList();
            addEvent();
            Scroll();
            Search();
        }
        function loadList(){
            $.ajax({
                url:'/api/list',
                data:{
                   page:page,
                   size:size,
                   val:val
                },
                dataType:'json',
                success:function(res){
                   if(res.code===1){
                       total=res.total;
                       renderList(res.msg);
                   }
                }
            })
        }
        function renderList(data){
            var str='';
            data.map(function(file){
                str+=` <div class="con-list">
                <h2>${file.title}</h2>
           <p>${file.con}</p>
           <span data-id=${file._id} class="del">删除</span>
           </div>`
            })
            $('.con').append(str);
            scroll.refresh();
        }

        function addEvent(){
            $('.con').on('click','.del',function(){
                  var id=$(this).attr('data-id');
                  var that=$(this);
                  var url='/api/del?id='+id;
                  $.ajax({
                      url:url,
                      success:function(res){
                          if(res.code===1){
                            alert(res.msg);
                            that.parent().remove();
                          }
                      }
                  })
            })
        }
        function Scroll(){
              scroll.on('scroll',function(){
                    if(this.y<this.maxScrollY-120){
                         $('.up').html('释放加载更多');
                    }else if(this.y<this.maxScrollY-60){
                        $('.up').html('上拉加载');
                    }
                    if(page>=total){
                        $('.up').html('没有更多数据');
                    }
              })
              scroll.on('scrollEnd',function(){
                   if($('.up').html()==='释放加载更多'){
                           page++;
                           $('.up').html('上拉加载');
                           loadList()
                   }
              })
        }
        function Search(){
              $('.btn').on('click',function(){
                  val=$('.ipt').val().trim();
                  page=1;
                  $('.con').html('');
                  $('.up').html('上拉加载');
                  loadList();
              })
        }
    })
})