import React, { useState, useCallback, useEffect } from "react";
import DateTimeInput from "./DateTimeInput";
import "./Main.css";

let id: number; // Should be per component

const Main = () => {
    const [text, setText] = useState(`${Math.floor(new Date().getTime()/1000)}`);
    const onChange = useCallback((e)=>{
        setText(e.target.value);
    }, [setText]);
    const onFirstInteraction = useCallback(() => {
        if(id) {
            cancelAnimationFrame(id);
            id = null;
        }
    }, []);

    useEffect(() => {
        let currentTime;
        id = requestAnimationFrame(animate);
        function animate () {
            const newTime = Math.floor(new Date().getTime()/1000);
            if(currentTime!=newTime) {
                currentTime = newTime;
                setText(`${newTime}`);
            }
            id = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(id);
        }
    }, [])

    const num = parseInt(text);
    return <>
        <input value={text} onChange={onChange} onMouseDown={onFirstInteraction}
            onKeyDown={onFirstInteraction} style={{
            width: "100%"
        }}  placeholder="Unixtime (e.g. 1234567890)" autoFocus />
        {isNaN(num) ?
            "Not a number" :
            <ul>
                <li><DateTimeInput title="(s)" unixTimeMillis={num*1000} setUnixTimeMillis={(s)=>{
                    setText(`${Math.floor(s/1000)}`);
                }} /></li>
                <li><DateTimeInput title="(ms)" unixTimeMillis={num} setUnixTimeMillis={(s)=>{
                    setText(`${Math.floor(s)}`);
                }} /></li>
            </ul>
            }
    </>
}

export default Main;
