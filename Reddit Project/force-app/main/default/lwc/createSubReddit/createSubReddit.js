import { LightningElement,track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import SUBREDDIT_OBJECT from "@salesforce/schema/SubReddit__c"
import SUBREDDIT_TITLE_FIELD from "@salesforce/schema/SubReddit__c.Title__c"
import SUBREDDIT_CATEGORY_FIELD from "@salesforce/schema/SubReddit__c.Category__c"


export default class CreateSubReddit extends LightningElement {
   
    @track 
    isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

    subRedditObject = SUBREDDIT_OBJECT;
    title = SUBREDDIT_TITLE_FIELD;
    category = SUBREDDIT_CATEGORY_FIELD;

    SubredditId = '';
    titleProp = '';
    categoryProp = '';

      handleTitleChange(event) {
       
        this.titleProp = event.target.value;
    }

    handleCategoryChange(event) {
       
        this.categoryProp = event.target.value;
    }

    handleSubmit() {
        const fields = {};
        fields[SUBREDDIT_TITLE_FIELD.fieldApiName] = this.titleProp;
        fields[SUBREDDIT_CATEGORY_FIELD.fieldApiName] = this.categoryProp;
        

        const recordInput = { apiName: SUBREDDIT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(subred => {
                this.SubredditId = subred.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'SubReddit created',
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