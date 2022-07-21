public with sharing class FetchSubreddits {
    
    @AuraEnabled(cacheable = true)
    public static List<SubReddit__c> getAllSubreddits() {
        
        return [SELECT Id, Name, Title__c, Category__c FROM SubReddit__c order by createddate desc];

    }

    @AuraEnabled(cacheable = true)
    public static List<SubReddit__c> getSearchedSubreddits(String searchKey) {
        System.debug('seach key word is' + searchKey);
        String skey = '%' + searchKey + '%';
        
        return [SELECT Id, Name, Title__c, Category__c FROM SubReddit__c WHERE Title__c LIKE :skey order by createddate desc];

    }

    @AuraEnabled
    public static List<Post__c> getAllPosts(String parentSubReddit) {
        System.debug('I am in all post query');
        
        return [select id, Body__c ,SubReddit__c, Name, Post_Title__c from Post__c where SubReddit__c =: parentSubReddit order by createddate desc] ;

    }

    @AuraEnabled(cacheable = true)
    public static List<Post__c> getSearchedPosts(String searchKey, String parentSubReddit) {
        System.debug('I am in search post query');
        String skey = '%' + searchKey + '%';
        
        return [select id, Body__c ,SubReddit__c, Name, Post_Title__c from Post__c where Post_Title__c like :skey AND SubReddit__c =: parentSubReddit order by createddate desc] ;

    }

    @AuraEnabled
    public static List<Comment__c> getAllComments(String parentPost) {
        
        
        return [select id, Name, Body__c from Comment__c where Post__c =: parentPost order by createddate desc];

    }

    @AuraEnabled
    public static List<Post__c> getPostForComment(String postId) {
        
        
        return [select id, Body__c ,SubReddit__c, Name, Post_Title__c from Post__c where Id =: postId LIMIT 1] ;

    }
}
