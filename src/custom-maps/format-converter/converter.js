//TODO: Write converter for svg files
import Canada from '../nodeCanada/index.js'

function converter(){    
    //1. Convert imported JSON map to JavaScript object
    let obj = JSON.parse(Canada);
    console.log(obj)
    
    //3. Change all "id" keys to exactly match "name" keys 
    
    //4. export the function
}

converter();

export default converter; 
