import { AbstractControl } from "@angular/forms";
 
export function usernameValidator(control:AbstractControl){
    if(control&&(control.value!==null||control.value!==undefined)){
        const regex=new RegExp(/[a-zA-Z0-9-_]{4,24}/)

        if(!regex.test(control.value)){
            return{
                usernameError:true
            }
        }
    }
    return null
}

