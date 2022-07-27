({
    doInit: function(cmp, evt, helper) {
        var myPageRef = cmp.get('v.pageReference');
        var postIdfromLWC = myPageRef.state.c__post_Id;

        console.log('post id from controller' + postIdfromLWC);
        cmp.set('v.postId', postIdfromLWC);

    }
})