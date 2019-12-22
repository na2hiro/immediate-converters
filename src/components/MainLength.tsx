import React, { useState, useCallback, useEffect, FunctionComponent } from "react";
import "./MainLength.css";
import numeral from "numeral";

let id: number; // Should be per component

type Unit = {
    name: string;
    unit: string;
    amount: number;
}

// TODO plural
const lengths: Unit[] = [
    {name: "kilometer", unit: "km", amount: 1000},
    {name: "meter", unit: "m", amount: 1},
    {name: "mile", unit: "mi", amount: 1609.344},
    {name: "yard", unit: "yd", amount: 0.9144},
    {name: "feet", unit: "ft", amount: 0.03048},
    {name: "inch", unit: "in", amount: 0.00254},
]

const weights: Unit[] = [
    {name: "kilogram", unit: "kg", amount: 1000},
    {name: "gram", unit: "g", amount: 1},
    {name: "ton", unit: "t", amount: 907200},
    {name: "hundredweight", unit: "cwt", amount: 45360},
    {name: "quarter", unit: "qr", amount: 11340},
    {name: "pound", unit: "lb", amount: 453.6},
    {name: "ounce", unit: "oz", amount: 28.35},
    {name: "dram", unit: "dr", amount: 1.772},
    {name: "grain", unit: "gr", amount: 0.06480},
]

const times: Unit[] = [
    {name: "year", unit: "y", amount: 60*60*24*365},
    {name: "week", unit: "w", amount: 60*60*24*7},
    {name: "month", unit: "mo", amount: 60*60*24*30},
    {name: "day", unit: "d", amount: 60*60*24},
    {name: "hour", unit: "h", amount: 60*60},
    {name: "minute", unit: "m", amount: 60},
    {name: "second", unit: "s", amount: 1},
    {name: "millisecond", unit: "ms", amount: 0.001},
]

const MainLength = () => {
    const [text, setText] = useState(``);
    const onChange = useCallback((e)=>{
        setText(e.target.value);
    }, [setText]);

    const parsed = parse(text);
    console.log(parsed);
    return <>
        <input value={text} onChange={onChange} style={{
            fontSize: "40px",
            width: "100%"
        }} autoFocus placeholder="300lb in kg" />
        <h2>Length conversion</h2>
        <UnitTable units={lengths} num={isNaN(parsed.num) ? 1 : parsed.num} filterUnit={parsed.unit} filterInUnit={parsed.inUnit} />
        <h2>Weights conversion</h2>
        <UnitTable units={weights} num={isNaN(parsed.num) ? 1 : parsed.num} filterUnit={parsed.unit} filterInUnit={parsed.inUnit} />
        <h2>Time conversion</h2>
        <UnitTable units={times} num={isNaN(parsed.num) ? 1 : parsed.num} filterUnit={parsed.unit} filterInUnit={parsed.inUnit} />
    </>
}

type Props = {
    units: Unit[];
    num: number,
    filterUnit?: string;
    filterInUnit?: string;
}

const formatter = new Intl.NumberFormat();

const UnitTable: FunctionComponent<Props> = ({units, num, filterUnit, filterInUnit}) => {
    return <table style={{textAlign: "right"}}>
        <thead>
            <tr>
                <th></th>
                {units.map(unitIn => <th style={{
                    color: filterInUnit && (unitIn.unit.indexOf(filterInUnit)!=0 && unitIn.name.indexOf(filterInUnit)!=0) ? "#aaa" : null
                }}>in {unitIn.name}</th>)}
            </tr>
        </thead>
        <tbody>
            {units.map(unit => <tr style={{
                color: filterUnit && (unit.unit.indexOf(filterUnit)!=0 && unit.name.indexOf(filterUnit)!=0) ? "#aaa" : null
            }}>
                <th>{num} {unit.name}</th>
                {units.map(unitIn => <td style={{
                    color: filterInUnit && (unitIn.unit.indexOf(filterInUnit)!=0 && unitIn.name.indexOf(filterInUnit)!=0) ? "#aaa" : null
                }}>
                    {formatter.format(num * unit.amount / unitIn.amount)+unitIn.unit}
                </td>)}
            </tr>)}
        </tbody>
    </table>
}

type ParseResult = {
    num?: number,
    unit?: string,
    inUnit?: string
}

const parse = (text: string) => {
    if(text==="") return {num: NaN};
    const num = parseFloat(text);
    const match = /\s*[\d,.]*(.*)$/.exec(text);
    if(!match) return {num};
    const remaining = match[1].trim();
    const [unit, inString, inUnit] = remaining.split(/\s+/);
    return {
        num,
        unit: unit ? unit.trim() : undefined,
        inUnit: inString == "in" && inUnit ? inUnit.trim() : undefined
    };
}

export default MainLength;