import React, { useState, useCallback, useEffect } from "react";

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
            fontSize: "40px",
            width: "100%"
        }}  placeholder="Unixtime (e.g. 1234567890)" autoFocus />
        {isNaN(num) ?
            "Not a number" :
            <ul>
                <li><DateDisplay name="Unixtime (s)" date={new Date(num*1000)} /></li>
                <li><DateDisplay name="Unixtime (ms)" date={new Date(num)} /></li>
            </ul>
            }
    </>
}

const DateDisplay = ({name, date}) => {
    const wrongRange = date.getYear()>300 || date.getYear()<80;
    return <span style={{
        color: wrongRange ? "gray" : "black",
        fontWeight: wrongRange ? "normal" : "bold"
    }} title={wrongRange ? "Year looks invalid" : ""}>
        {name}: {date.toString()}
    </span>
}

export default Main;