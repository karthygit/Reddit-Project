import { api, LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { createRecord } from 'lightning/uiRecordApi';


import COMMENT_OBJECT from "@salesforce/schema/Comment__c"
import COMMENT_BODY_FIELD from "@salesforce/schema/Comment__c.Body__c"
import COMMENT_POST_FIELD from "@salesforce/schema/Comment__c.Post__c"


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
        if(refreshed = false){
            window.location.reload();
            refreshed = true;

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

    onCommentChange(event){
       
        this.commentValue = event.detail.value;
        console.log('COMMENT VALUE IS >>'+this.commentValue);
    }
    
    handleSaveComment(event){
        const fields = {};
        fields[COMMENT_BODY_FIELD.fieldApiName] = this.commentValue;
        fields[COMMENT_POST_FIELD.fieldApiName] = event.target.dataset.recordId;

        const recordInput = { apiName: COMMENT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
        .then(result => {
            console.log('RESULTID IS >>' + result.data);
            console.log('COMMENT VALUE BEFORE IS >>' + this.commentValue);
            this.commentValue = '';
            console.log('COMMENT VALUE AFTER IS >>' + this.commentValue);
        })
        .catch(error => {console.log(error)});
    }



   }