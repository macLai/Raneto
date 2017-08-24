function editOne(floor) {
    var textarea = $("#reply_content")[0];
    var content = $("#floor"+floor+" .reply_content")[0].textContent;
    textarea.value = "#" + floor + ":\n" + content;
    
    try {
        var textinput = $("#reply_project")[0];
        var project = $("#floor"+floor+" .reply_project")[0].textContent;
        textinput.value = project;
    } catch(err) {
    }
    textarea.focus();
    //TODO: 画面移到最下面
}

function replyOne(target) {
    var textarea = $("#reply_content")[0];
    var content = textarea.value;
    content = content.length != 0 ? content + "\n@" + target + " " : "@" + target + " ";
    textarea.value = content;
    textarea.focus();
}

function removeOne(target) {
    var ans=confirm("确定删除？");
    if(ans) {
        $.post($("#comment_post").attr("action"), {action: "delete", floor: target}, function(data,status){
            window.location.reload();
        });
    }
}


// 树测试
var setting = {
    async: {
		enable: true,
		url:"/_pagelist",
		autoParam:["id", "name", "level"]
    },
    view: {
        showLine: false,
        showIcon: false
    }
}

$(document).ready(function() {
    $.fn.zTree.init($("#treeDemo"), setting);
})