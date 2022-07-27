import { LightningElement,track,api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import POST_TITLE_FIELD from "@salesforce/schema/Post__c.Post_Title__c"
import POST_BODY_FIELD from "@salesforce/schema/Post__c.Body__c"
import POST_SUBREDDIT_FIELD from "@salesforce/schema/Post__c.SubReddit__c"
import POST_OBJECT from "@salesforce/schema/Post__c"

export default class CreatePost extends LightningElement  {
   @api subRedNameToLWC;
    @track isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    postObject = POST_OBJECT;
    postTitle = POST_TITLE_FIELD;
    postBody = POST_BODY_FIELD;

    @api subRedIdToLWC;
    postId;
    title = '';
    body = '';

    handleTitleChange(event) {
        this.postId = undefined;
        this.title = event.target.value;
    }

    handleBodyChange(event) {
        this.postId = undefined;
        this.body = event.target.value;
    }

    handleSubmit() {
        const fields = {};
        fields[POST_TITLE_FIELD.fieldApiName] = this.title;
        fields[POST_BODY_FIELD.fieldApiName] = this.body;
        fields[POST_SUBREDDIT_FIELD.fieldApiName] = this.subRedIdToLWC;

        const recordInput = { apiName: POST_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(post => {
                this.postId = post.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Post created',
                        variant: 'success',
                    }),
                );
                this.isShowModal = false;
                window.location.reload();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}