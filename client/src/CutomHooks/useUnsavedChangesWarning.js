import React, { useState, useEffect } from 'react'
import {Prompt} from 'react-router-dom'
const useUnsavedChangesWarning = (message = "Are your sure want to discard changes?")=>{
    const [isDirty, setDirty] = useState(false);
    const [isEditorContentDirty, setEditorContentDirty] = useState(false);
    
    useEffect(()=>{
        console.log(isDirty);
        console.log(isEditorContentDirty);
        // Detecting browser closing
        window.onbeforeunload = (isDirty || isEditorContentDirty) && (()=>message);

        return () =>{
            window.onbeforeunload = null;
        }

    },[isDirty, isEditorContentDirty]);

    //const routerPrompt = <Prompt when={isDirty} message = {message}/>;
    //return [routerPrompt, ()=> setDirty(true), ()=>setDirty(false)];
    return [()=> setDirty(true), ()=>{setDirty(false); setEditorContentDirty(false)}, ()=>setEditorContentDirty(true)];
}

export default useUnsavedChangesWarning;