import { api, LightningElement, track, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import getAllComments from "@salesforce/apex/FetchSubreddits.getAllComments"
import getPostForComment from "@salesforce/apex/FetchSubreddits.getPostForComment"

import COMMENT_ID_FIELD from "@salesforce/schema/Comment__c.Id";
import COMMENT_UPVOTE_FIELD from "@salesforce/schema/Comment__c.No_of_Upvotes__c";
import COMMENT_DOWNVOTE_FIELD from "@salesforce/schema/Comment__c.No_of_Downvotes__c";


export default class CommentPage extends LightningElement {

    @api postId;

    alwaysTrue = false;
    postTitle = '';
    postBody = '';

    @track
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

    handleCommentSuccess(){

        this.template.querySelectorAll('lightning-input-field[data-id="reset"').forEach(element => {
                element.value = null;
            });

            window.location.reload();
    }

    handleVote(event){
        let commentIdForVote = event.target.dataset.recordId;
        let recIndex = event.target.dataset.index;

        const fields = {};
        fields[COMMENT_ID_FIELD.fieldApiName] = commentIdForVote;

        if(event.target.name === "myUpVote"){
            let upVoteCountVar = this.commentList[recIndex].No_of_Upvotes__c +1;
            this.commentList[recIndex].No_of_Upvotes__c = this.commentList[recIndex].No_of_Upvotes__c+1;
            //this.subRedditList[recIndex].No_of_Upvotes__c = upVoteCountVar + 1;
            console.log('upVoteCountVar is >> '+ upVoteCountVar);
            fields[COMMENT_UPVOTE_FIELD.fieldApiName] = upVoteCountVar;
         }

        if(event.target.name === "myDownVote"){
            let downVoteCountVar = this.commentList[recIndex].No_of_Downvotes__c +1;
            this.commentList[recIndex].No_of_Downvotes__c = this.commentList[recIndex].No_of_Downvotes__c +1;
            console.log('downVoteCountVar is >> '+ downVoteCountVar);
            fields[COMMENT_DOWNVOTE_FIELD.fieldApiName] = downVoteCountVar;
        }

        const recordInput = { fields };
           updateRecord(recordInput)
           .then(() => {console.log('update success');})
           .catch(()=> {console.log('update rec failed')})
    }

}