import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import getSearchedSubreddits from "@salesforce/apex/FetchSubreddits.getSearchedSubreddits";
import getAllSubreddits from "@salesforce/apex/FetchSubreddits.getAllSubreddits";
import { updateRecord } from 'lightning/uiRecordApi';
import UPVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_of_Downvotes__c"
import SUBRED_ID_FIELD from "@salesforce/schema/SubReddit__c.Id";

export default class DisplayPost extends NavigationMixin(LightningElement) {

    
    keyword = '';

    @track
    subRedditList = '';

    temp = '';

    connectedCallback(){

        getAllSubreddits()
        .then(result => {
            this.subRedditList = result;
        })
        .catch(error => {
            console.log(error);
        });

    }

    handleChange(event){
        
        this.keyword = event.detail.value ;
        console.log('LOGGED'+event.detail.value);
    }


    @wire(getSearchedSubreddits, {searchKey : '$keyword'})
    resultgroups({data, error}){
        if(data){
            console.log('temp wire >'+ this.temp);
            this.temp = data;
        }
        if(error){
            Console.log(error);
        }
       
    };

    handleSearch(){
        console.log('temp >'+ this.temp);
        console.log('KEYWOrd is >>' + this.keyword);
        this.subRedditList = this.temp;
    }

    handleClick(event){

        console.log('event.target.dataset.recordId>>'+event.target.dataset.recordId);

        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__PostsUIPage"
            },
            state: {
                c__SubrredId: event.target.dataset.recordId,
                c__SubredName: event.target.dataset.name
            }
        });
    }


    handleVote(event){
        let subRedIdForVote = event.target.dataset.recordId;
        let recIndex = event.target.dataset.index;

        const fields = {};
        fields[SUBRED_ID_FIELD.fieldApiName] = subRedIdForVote;

        if(event.target.name === "myUpVote"){
            let upVoteCountVar = this.subRedditList[recIndex].No_of_Upvotes__c +1;
            this.subRedditList[recIndex].No_of_Upvotes__c = upVoteCountVar;
            console.log('upVoteCountVar is >> '+ upVoteCountVar);
            fields[UPVOTE_FIELD.fieldApiName] = upVoteCountVar;
         }

        if(event.target.name === "myDownVote"){
            let downVoteCountVar = this.subRedditList[recIndex].No_of_Downvotes__c +1;
            this.subRedditList[recIndex].No_of_Downvotes__c = downVoteCountVar;
            console.log('downVoteCountVar is >> '+ downVoteCountVar);
            fields[DOWNVOTE_FIELD.fieldApiName] = downVoteCountVar;
        }

        const recordInput = { fields };
           updateRecord(recordInput)
           .then(() => {console.log('update success');})
           .catch(()=> {console.log('update rec failed')})
    }
}