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

function watchOne(key, user) {
    $.post('/_watchchange/', {key: key, user: user}, function(result) {
        window.location.reload();
    })
}


// 树测试
$(document).ready(function() {
    var setting = {
        async: {
            enable: true,
            url: $(".sidebar-nav").attr("request"),
            autoParam:["id", "name", "level"],
            otherParam:["path", $(".sidebar-nav").attr("para")]
        },
        view: {
            showLine: false,
            showIcon: false,
            fontCss: getFont,
            nameIsHTML: true
        },
        callback: {
            beforeClick: function (treeId, treeNode, clickFlag) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.expandNode(treeNode);
                return (treeNode.click != false);
            }
        }
    };
    function getFont(treeId, node) {
        return node.font ? node.font : {};
    }
    $.fn.zTree.init($("#treeDemo"), setting);
})