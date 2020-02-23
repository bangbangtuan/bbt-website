var storage={


    set(key,value){

        localStorage.setItem(key,JSON.stringify(value));
        
    },
    get(key){
        let value = localStorage.getItem(key);
        if(value === undefined) {
            console.log('aaa')
            return "";
        }
        return JSON.parse(localStorage.getItem(key));


    },
    remove(key){

        localStorage.removeItem(key)
    }
};
export default storage;
