import { api, LightningElement, wire } from 'lwc';
import getAllComments from "@salesforce/apex/FetchSubreddits.getAllComments"
import getPostForComment from "@salesforce/apex/FetchSubreddits.getPostForComment"


export default class CommentPage extends LightningElement {

    @api postId;
    postTitle = '';
    postBody = '';

    commentList='';

    connectedCallback(){
       

        getAllComments({parentPost : this.postId})
        .then(result => {
            this.commentList = result;
        })
        .catch(error => {
            console.log(error);
        });

        getPostForComment({postId : this.postId})
        .then(result => {
            console.log('result title is >>'+result[0].Post_Title__c);
            this.postBody = result[0].Body__c;
            this.postTitle = result[0].Post_Title__c;
        })
        .catch(error => {
            console.log(error);
        });

    }

}