
'use strict';

function page_list(config, raneto) {
    return function (req, res, next) {
        res.header('Content-Type', 'text/html');
        var temp = [
            {
                id:'031',
                name:'n3.n1',
                isParent:true
            },
            {
                id:'032',
                name:'n3.n2',
                isParent:false
            },
            {
                id:'033',
                name:'n3.n3',
                isParent:true
            },
            {
                id:'034',
                name:'n3.n4',
                isParent:false
            }
        ]
        res.send(temp);
    }
}

// Exports
module.exports = page_list;
