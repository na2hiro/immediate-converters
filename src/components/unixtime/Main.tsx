import React, { useState, useCallback, useEffect } from "react";
import DateTimeInput from "./DateTimeInput";
import UnixTimeInput from "./UnixTimeInput";
import "./Main.css";

let id: number | undefined = -1; // Should be per component

const Main = () => {
    const [unixTime, setUnixTime] = useState(Math.floor(new Date().getTime()/1000));

    const onFirstInteraction = useCallback(() => {
        if (id > 0) {
            cancelAnimationFrame(id);
        }
        id = undefined;
    }, []);

    useEffect(() => {
        let currentTime: number;
        id = requestAnimationFrame(animate);
        function animate () {
            const newTime = Math.floor(new Date().getTime()/1000);
            if(currentTime!=newTime) {
                currentTime = newTime;
                setUnixTime(newTime);
            }
            id = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(id);
        }
    }, [])

    return <div onMouseDown={onFirstInteraction} onKeyDown={onFirstInteraction}>
        <UnixTimeInput unixTime={Math.floor(unixTime)} setUnixTime={setUnixTime} noInteractionYet={!isNaN(id)} />
        <DateTimeInput title="(s)" unixTimeMillis={unixTime * 1000} setUnixTimeMillis={(s) => {
            setUnixTime(Math.floor(s/1000));
        }} />
        <DateTimeInput title="(ms)" unixTimeMillis={unixTime} setUnixTimeMillis={(s)=>{
            setUnixTime(Math.floor(s));
        }} />
    </div>
}

export default Main;
