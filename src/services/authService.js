import storage from "../component/storage";

const authService = {
    checkUsrStatus : async function() {
        //let status = false;
        let token = storage.get('token');
        if(token) {
            let res = await fetch('https://testapi.bangneedu.com/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                }});
            let data = await res.json();
            console.log(data)
            if(data.status === 200) {
                storage.set('headPortrait', data.data.headPortrait);
                return true;
            } else if(data.status === 401){
                storage.set('headPortrait', '');
                storage.set('token', '');
                return false;
            }
        } else {
            console.log("Enter false token")
            return false;
        }
    }
};

export default authService;
