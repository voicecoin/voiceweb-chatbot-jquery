var agentId = urlPara ('agentId=');

$(document).ready(function(){
    loadLeft();
    queryAgentsById();
});

function loadLeft(){
    $.get("/src/workshop/left.html", function(data) {
        $('#leftmenu').html(data);
        loadBots();
    }, "html");
}

layui.use('laydate', function() {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#birthday'
        , lang: 'en'
        ,value: new Date()
    });
});


var image = '';
function selectImage(file){
    if(!file.files || !file.files[0]){
        return;
    }
    image = '';
    var reader = new FileReader();
    reader.onload = function(evt){
        document.getElementById('avatar').src = evt.target.result;
        image = evt.target.result;
        //updateBot();

    }
    reader.readAsDataURL(file.files[0]);
}

function openfile(){
    document.getElementById('file_image').click();
}


function queryAgentsById(){
    $.get(host + '/v1/Agents/'+agentId, function(data){
        initFormValues(data);
    });
}
var botId = '';
function initFormValues(info){
    var $name = $("#name");
    var $description = $("#description");
    var $birthday = $("#birthday");
    var $language = $("#language");
    var $client_token = $("#client_token");
    var $dev_token = $("#dev_token");
    var isPublic = $("input[name='isPublic']:checked").val();
    var published = info.published;
    botId = info.id;
    $name.val(info.name);
    $description.val(info.description);
    $birthday.val(info.birthday);
    $language.val(info.language);

    if(info.avatar){
        document.getElementById('avatar').src = info.avatar;
    }
    if(published){
        $("#isPublic1").removeAttr('checked');
        $("#isPublic2").attr('checked',true);
    }else{
        $("#isPublic2").removeAttr('checked');
        $("#isPublic1").attr('checked',true);
    }
    $client_token.html(info.clientAccessToken);
    $dev_token.html(info.developerAccessToken);
}


function saveBot(){
    var $name = $("#name");
    var name = $name.val();
    var $description = $("#description");
    var description = $description.val();
    var $birthday = $("#birthday");
    var birthday = $birthday.val();
    var $language = $("#language");
    var language = $language.val();
    var isPublic = $("input[name='isPublic']:checked").val();
    if(!name){
        jqueryAlert({
            'content' : '请输入机器人名称'
        })
        return false;
    }
    var data={};
    data.id = botId;
    data.name=name;
    data.description=description;
    data.published= isPublic == 1 ? true:false;
    data.avatar=image;
    data.birthday = birthday;
    data.language = language;

    $.ajax({
        url: host + '/v1/Agents',
        type: "put",
        datType: "JSON",
        contentType: "application/json",
        data: data,
        success: function (json) {
            toastr.success("编辑成功",'ok');
            window.location.reload();
        },error: function(e) {
            jqueryAlert({
                'content' :'网络异常，请稍后重试'
            })
        }
    });
    /* $.put(host + '/v1/Agents', data, function(){
        toastr.success("编辑成功",'ok');
        window.location.reload();
    });*/
}