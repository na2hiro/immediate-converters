import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import React from "react";

const UnixTimeInput = ({unixTime, setUnixTime, noInteractionYet}) => {
    const ref = useRef<HTMLInputElement>();
    const [text, setText] = useState(`${unixTime}`);
    const onChange = useCallback((e)=>{
        setText(e.target.value);
        const time = parseInt(e.target.value);
        if(!isNaN(time)) {
            setUnixTime(time);
        }
    }, [setText]);

    const componentDate = buildDate(text);
    useEffect(() => {
        if(componentDate && componentDate.getTime() == unixTime) {
            return;
        }
        setText(`${unixTime}`);
    }, [unixTime]);

    useSelectAllWhileNoInteraction(noInteractionYet, ref.current);

    return (
        <input value={text} onChange={onChange} ref={ref} style={{
            width: "100%"
        }}  placeholder="Unixtime (e.g. 1234567890)" autoFocus />
    );
}

const useSelectAllWhileNoInteraction = (noInteractionYet: boolean, inputElement: HTMLInputElement) => {
    useLayoutEffect(()=> {
        if(noInteractionYet && inputElement) {
            inputElement.setSelectionRange(0, inputElement.value.length);
        }
    });
}

const buildDate = (text: string) => {
    const time = parseInt(text);
    return isNaN(time) ? undefined : new Date(time);
}

export default UnixTimeInput;
