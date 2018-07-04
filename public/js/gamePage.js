var player_color;
var running_flag = false;
var dir_x = [1, 1, 0, 0, 1, -1, -1, -1];
var dir_y = [1, -1, 1, -1, 0, 0, -1, 1];
var m = [];
var flag = 0;

var t;
function Init()
{
    for (var i = 0;i < 64;++i){
        Display(i, 0);
        $('.grids')[i].index = i;
        m[i] = 0;
    }
    Display(27, 1);
    Display(28, -1);
    Display(35, -1);
    Display(36, 1);
    m[27] = 1;
    m[28] = -1;
    m[35] = -1;
    m[36] = 1;
    $("#choose_color").fadeIn();
    running_flag = false;
    for (var i = 0;i < 64;++i)
        $('.grids')[i].style.backgroundColor = 'green';
    ShowNum();
    sec = 30;
    clearTimeout(t);
}
function PickColor(_c)
{
    player_color = _c;
    if (player_color == -1)
        ShowHint();
    else
        //setTimeout("AI_1("+player_color * -1+")", 1000);
        ShowHint();
    running_flag = true;
}
//white: 1
//black: -1
//none: 0
function Display(_index, _color)
{
    if(_color==0){
        $('#b'+_index).fadeOut(0);
        $('#w'+_index).fadeOut(0);
        return;
    }
    var tag="#"+(_color==1?'w':'b')+_index;
    var not_tag="#"+(_color==-1?'w':'b')+_index;
    $(not_tag).fadeOut(0);
    $(tag).fadeIn('slow');
}
$(document).ready(function(){
    Init();
});

function Attack(_index, _c)
{
    var attack = [];
    var x = _index >> 3;
    var y = _index % 8;
    if (m[_index] != 0) return attack;
    for (var j = 0;j < 8;++j){
        var nx = x + dir_x[j];
        var ny = y + dir_y[j];
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8){
            if (m[(nx << 3) + ny] == (_c * -1)){
                var tx = nx, ty = ny;
                var ta = [(nx << 3) + ny];
                var tf = false;
                for(;;){
                    tx+=dir_x[j], ty+=dir_y[j];
                    if (tx >= 0 && tx < 8 && ty >= 0 && ty < 8){
                        if (m[(tx << 3) + ty] == _c){
                            tf = true;
                            break;
                        }
                        if (m[(tx << 3) + ty] == 0) break;
                        ta.push((tx << 3) + ty);
                    }
                    else break;
                }
                if (tf) attack = attack.concat(ta);
            }
        }
    }
    return attack;
}

function PossiblePlace(_c)
{
    var p = [];
    for (var i = 0;i < 64;++i){
        var a = Attack(i, _c);
        if (a.length) p.push(i);
    }
    return p;
}

function ShowHint()
{
    var p = PossiblePlace(player_color);
    for (var i = 0;i < 64;++i)
        $('.grids')[i].style.backgroundColor = 'green';
    for (var i = 0;i < p.length;++i)
        $('.grids')[p[i]].style.backgroundColor = 'rgb(0, 40, 0)';
}

function ClickGrid(_this)
{
    if (!running_flag) return;
    if (m[_this.index] != 0) return;
    if (!Attack(_this.index, player_color).length) return;
    Move(_this.index, player_color);
    var p = PossiblePlace(player_color*-1);
    if (!p.length){
        ShowNum();
        ShowHint();
    }
    //setTimeout("AI_1("+player_color * -1+")", 1000);
    player_color = player_color*-1;
    ShowHint();
    if(p.length==0)
    {
        player_color = player_color*-1;
        ShowHint();
    }
    sec = 30;
}

function ShowNum()
{
    var wn = 0, bn = 0;
    for (var i = 0;i < 64;++i){
        if (m[i] == -1) ++bn;
        if (m[i] == 1) ++wn;
    }
    $('#c_black')[0].innerText = bn;
    $('#c_white')[0].innerText = wn;
    if (bn > wn) return -1;
    if (bn == wn) return 0;
    if (bn < wn) return 1;
}
var end;
function Move(_index, _c)
{
    var a = Attack(_index, _c);
    if (!a.length) return;
    m[_index] = _c;
    Display(_index, _c);
    for (var i = 0;i < a.length;++i)
    {
        m[a[i]] = _c;
        Display(a[i], _c);
    }
    ShowNum();
    end = IsEnd();
    for (var i = 0;i < 64;++i)
        $('.grids')[i].style.backgroundColor = 'green';
    if (end){
        running_flag = false;
        if (ShowNum() == 0)
            $('#result')[0].innerText = 'The result is Even.';
        if (ShowNum() == player_color)
            $('#result')[0].innerText = 'You win!';
        if (ShowNum() == -1 * player_color)
            $('#result')[0].innerText = 'You lose!';
        $('#end_info').modal('show');
    }
}
function res() {
    running_flag = false;
    if (ShowNum() == 0)
        $('#result')[0].innerText = 'The result is Even.';
    if (ShowNum() == player_color)
        $('#result')[0].innerText = 'You win!';
    if (ShowNum() == -1 * player_color)
        $('#result')[0].innerText = 'You lose!';
    $('#end_info').modal('show');
}
function AI_1(_c)
{
    var p = PossiblePlace(_c);
    if (p.length == 0) return false;
    var r = Math.floor(Math.random()*100) % p.length;
    Move(p[r], _c);
    ShowHint();
    var p = PossiblePlace(_c*-1);
    if (!p.length){
        setTimeout("AI_1("+_c+")", 1000);
    }
    return true;
}

function IsEnd()
{
    var pb = PossiblePlace(-1);
    var pw = PossiblePlace(1);
    if (!pb.length && !pw.length){
        return true;
    }
    return false;

}
var sec = 30;

function countDown(){         //一进该页面就加载以下方法
    if(sec > 0) {
        time.innerHTML = sec--;
    } else {
        player_color = player_color*-1;
        ShowHint();
        sec = 30;//轮换
    }                     //显示右下角日期的方法
    t = setTimeout('countDown()',1000);    //一般秒设置为参数为1000
}
                 //设置倒计时时间为30秒

