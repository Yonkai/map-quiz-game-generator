const jsonFormatConverter = (mapToConvertObject) => {    
    //1. Pull locations out of old map object
    const newMapLocations = mapToConvertObject.locations.map((location,index)=>{
        let newLocation = location;
        //change ids to names, replace spaces with hypens
        newLocation.id = location.name.split(' ').join('-');
        //change name to name with hyphens instead of spaces
        newLocation.name = location.name.split(' ').join('-');
        //return new locations
        return newLocation;
        })
    // 2. Make a clone of old map object
    const newMapToConvertObject = mapToConvertObject;
    // 3. Convert to fixed object with updated locations
    newMapToConvertObject.locations = newMapLocations;
    // 4. Return new converted object
    return newMapToConvertObject;
}

// Export the function
export default jsonFormatConverter; 