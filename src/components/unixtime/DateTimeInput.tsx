import React, { useEffect } from "react";
import {FunctionComponent, useState} from "react";
import "./DateTimeInput.css";

type Props = {
    unixTimeMillis: number;
    setUnixTimeMillis: (unitTime: number)=>void;
    title: string;
}

const DateTimeInput: FunctionComponent<Props> = ({unixTimeMillis, setUnixTimeMillis, title}) => {
    const date = new Date(unixTimeMillis);

    const [y, setY] = useState(`${date.getFullYear()}`);
    const [M, setM] = useState(`${date.getMonth()+1}`);
    const [d, setD] = useState(`${date.getDate()}`);
    const [h, setH] = useState(`${date.getHours()}`);
    const [m, setm] = useState(`${date.getMinutes()}`);
    const [s, setS] = useState(`${date.getSeconds()}`);

    const componentDate = buildDate(y, M, d, h, m, s);

    useEffect(() => {
        if(componentDate && (componentDate.getTime() == date.getTime())) {
            return;
        }
        setY(pad(date.getFullYear()));
        setM(pad(date.getMonth() + 1));
        setD(pad(date.getDate()));
        setH(pad(date.getHours()));
        setm(pad(date.getMinutes()));
        setS(pad(date.getSeconds()));
    }, [unixTimeMillis]);

    const wrongRange = date.getFullYear()>2200 || date.getFullYear()<1980;

    return <div className={"DateTimeInput "+ (wrongRange ? "DateTimeInput--wrong" : "")}>
        {title}
        <input value={y} size={5} style={{textAlign: "right"}} onChange={(e)=>{const v = e.target.value; setY(v);propagate(v, M, d, h, m, s);}} />-
        <input value={M} size={2} maxLength={2} onChange={(e)=>{const v = e.target.value; setM(v);propagate(y, v, d, h, m, s);}} />-
        <input value={d} size={2} maxLength={2} onChange={(e)=>{const v = e.target.value; setD(v);propagate(y, M, v, h, m, s);}} />-
        <input value={h} size={2} maxLength={2} onChange={(e)=>{const v = e.target.value; setH(v);propagate(y, M, d, v, m, s);}} />-
        <input value={m} size={2} maxLength={2} onChange={(e)=>{const v = e.target.value; setm(v);propagate(y, M, d, h, v, s);}} />-
        <input value={s} size={2} maxLength={2} onChange={(e)=>{const v = e.target.value; setS(v);propagate(y, M, d, h, m, v);}} />
        <Offset date={date} />
    </div>;

    function propagate(ys: string, Ms: string, ds: string, hs: string, ms: string, ss: string) {
        const newDate = buildDate(ys, Ms, ds, hs, ms, ss);
        if(newDate) {
            setUnixTimeMillis(newDate.getTime());
        }
    }
}

const Offset: FunctionComponent<{date: Date}> = ({date}) => {
    const offset = date.getTimezoneOffset();
    return <>{`${offset<=0 ? "+" : "-"}${pad(Math.abs(offset)/60*100, 4)}`}</>
}

function pad(n: number, len = 2) {
    let ns = n.toString();
    return new Array(Math.max(len-ns.length+1, 0)).join("0")+ns;
}

function buildDate(ys: string, Ms: string, ds: string, hs: string, ms: string, ss: string): Date | undefined {
    const y = parseInt(ys);
    const M = parseInt(Ms);
    const d = parseInt(ds);
    const h = parseInt(hs);
    const m = parseInt(ms);
    const s = parseInt(ss);
    if(!(y>0 && 1<=M && M<=12 && 1<=d && d<=31 && 0<=h && h<=23 && 0<=m && m<=59 && 0<=s && s<=59)){
        return;
    }
    return new Date(y, M-1, d, h, m, s)
}

export default DateTimeInput;
