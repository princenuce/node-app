    $(function(){
        var m = 'phimmoi';
        $('.server').click(function(e){
            $(this).addClass('active').siblings('.active').removeClass('active');
            m = $(this).data('sv');
            return search();
        })

        function search(){
            var keyword = $('input[name="q"]').val() || false;
            if(keyword){
                $.get('/search/'+m+'/'+keyword, function(e){
                    link = '';
                    e.id.forEach(function(ele, ind){
                        link += '<p><a href="#" onclick="watch(\''+m+'\','+ele+')" data-module="' + m + '" data-id="' + ele + '">' + e.name[ind] + '</a></p>';
                    });
                    $('#result').html(link);
                });
            }
        }
    });
    function changeVideo(e){
        video = $('.video video')[0];
        a = video.currentTime;
        video.src = e.getAttribute('data-url');
        $('.def').html(e.getAttribute('data-s'));
        video.currentTime = a;
        video.load();
        video.play();
    }
    function watch(m,e,o){
        var id = e || false;
        if(id){
            $.get('/watch/'+m+'/'+id + (o == true ? '/'+o : ''), function(data){
                data = JSON.parse(JSON.stringify(data));
                data.url.reverse();
                data.resulotion.reverse();
                select = [];
                data.url.forEach(function(ele, ind){
                    video = '';
                    video += '<h2>'+data.title+ '<br />'+data.resulotion[ind]+'p</h2>';
                    video += '<video controls poster="http://www.arsenal.com/assets/images/player/placeholder_live_video.jpg" preload="none" src="'+ele+'" type="video/mp4">';
                    video += '</video>';
                    select[ind] = '<div onclick="changeVideo(this);" class="item" data-s="'+data.resulotion[ind]+'" data-url="'+ele+'">'+data.resulotion[ind]+'p</div>';
                })
                select[10] = '<div class="item def">360p</div>';
                video = '<div class="video">'+video+'<div class="selectquality">'+select.reverse().join('')+'</div></div>';
                $('#watch').html(video);
                $('#watch').show();

                // show chapterInfo
                if(data.chapter[0].length){
                    var rightbar = '<div class="title">Thông tin Phim</div>';
                    rightbar += '<ul>';
                    data.chapter.map(function(e){
                        var chap = '';
                        var svn = ''
                        e.map(function(e, i){
                            ind = Object.keys(e)[0];
                            ele = e[ind];
                            if(ind != 'servername')
                                chap += '<a href="#" class="chapter" onclick="watch(\''+m+'\',\''+ind+'\',true); return false;" data-module="' + m + '" data-id="' + ind + '">'+ele+'</a>';
                            else
                                svn= '<li><div class="serverChapter">' + ele + '</div>';
                        })
                        rightbar += svn + chap + '</li>'
                    })
                    rightbar += '</ul>';
                    $('#right-bar').html(rightbar);
                }
            });
        }
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        return false;
    }
