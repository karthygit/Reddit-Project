import { api, LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { updateRecord } from 'lightning/uiRecordApi';

import UPVOTE_FIELD from "@salesforce/schema/Post__c.No_of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/Post__c.No_of_Downvotes__c"
import POST_ID_FIELD from "@salesforce/schema/Post__c.Id";


import getSearchedPosts from "@salesforce/apex/FetchSubreddits.getSearchedPosts";
import getAllPosts from "@salesforce/apex/FetchSubreddits.getAllPosts";

let refreshed = false;
export default class DisplayPost extends NavigationMixin(LightningElement) {

    @api
    subRedIdToLWC;


    keyword = '';

    @track
    postList = '';

    temp = '';

    commentValue = '';

   

    
    
    connectedCallback(){
        console.log('subred id is' +this.subRedIdToLWC );

        getAllPosts({parentSubReddit : this.subRedIdToLWC})
        .then(result => {
            this.postList = result;
        })
        .catch(error => {
            console.log(error);
        });
        if(this.refreshed = false){
            window.location.reload();
            this.refreshed = true;

        }
        

    }

    handleChange(event){
        
        this.keyword = event.detail.value ;
        console.log('LOGGED'+event.detail.value);
    }


    @wire(getSearchedPosts, {searchKey : '$keyword', parentSubReddit : '$subRedIdToLWC'})
    resultgroups({data, error}){
        if(data){
            
            this.temp = data;
        }
        if(error){
            Console.log(error);
        }
       
    };

    handleSearch(){
        
        console.log('KEYWOrd is >>' + this.keyword);
        this.postList = this.temp;
    }

    handleViewComments(event){

        console.log('post id event.target.dataset.recordId>>'+event.target.dataset.recordId);
        console.log('event.target.dataset.body >>'+event.target.dataset.body);
        

        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__CommentsUIPage"
            },
            state: {
                c__post_Id: event.target.dataset.recordId
                
            }
        });

    }
    
    handleVote(event){
        let postIdForVote = event.target.dataset.recordId;
        let recIndex = event.target.dataset.index;

        const fields = {};
        fields[POST_ID_FIELD.fieldApiName] = postIdForVote;

        if(event.target.name === "myUpVote"){
            let upVoteCountVar = this.postList[recIndex].No_of_Upvotes__c +1;
            this.postList[recIndex].No_of_Upvotes__c = this.postList[recIndex].No_of_Upvotes__c+1;
            //this.subRedditList[recIndex].No_of_Upvotes__c = upVoteCountVar + 1;
            console.log('upVoteCountVar is >> '+ upVoteCountVar);
            fields[UPVOTE_FIELD.fieldApiName] = upVoteCountVar;
         }

        if(event.target.name === "myDownVote"){
            let downVoteCountVar = this.postList[recIndex].No_of_Downvotes__c +1;
            this.postList[recIndex].No_of_Downvotes__c = this.postList[recIndex].No_of_Downvotes__c + 1;
            console.log('downVoteCountVar is >> '+ downVoteCountVar);
            fields[DOWNVOTE_FIELD.fieldApiName] = downVoteCountVar;
        }

        const recordInput = { fields };
           updateRecord(recordInput)
           .then(() => {console.log('update success');})
           .catch(()=> {console.log('update rec failed')})
    }

    handleCommentSuccess(){

        this.template.querySelectorAll('lightning-input-field[data-id="reset"').forEach(element => {
                element.value = null;
            });
    }



   }