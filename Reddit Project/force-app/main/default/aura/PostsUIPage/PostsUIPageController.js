({
    doInit: function(cmp, evt, helper) {
        var myPageRef = cmp.get('v.pageReference');
        var srId = myPageRef.state.c__SubrredId;
        var srName = myPageRef.state.c__SubredName;

        
        
        cmp.set('v.subRedId', srId);
        cmp.set('v.subRedName', srName);
       // $A.get('e.force:refreshView').fire();
    },
    
    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    }
})