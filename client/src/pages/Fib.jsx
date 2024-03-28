import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Fib = () => {
    const [index, setIndex]=useState('')
    const [seenIndexes, setSeenIndexes]=useState([])
    const [values, setValues] = useState({})

    const fetchIndexes=async()=>{
        const response = await axios.get('/api/values/all');
        setSeenIndexes(response.data);
    }

    const fetchValues=async()=>{
        const response = await axios.get('/api/values/current');
        setValues(response.data);
    }

    const renderIndexes=()=>{
        return (
            seenIndexes.map(item=>item.number).join(',')
        )
    }
    const renderCalculatedValues=()=>{
        const entries=[];
        for(const index in values) {
            entries.push(
                <div key={index}>
                    For the value of {index}, I calculated - {values[index]}
                </div>
            );
        }
        return entries;
    }

    useEffect(()=>{
    fetchIndexes()
    fetchValues()
    },[])

    const onSubmit=async(e)=>{
        e.preventDefault();
        await axios.post('/api/values',{index})
    }
  return (
    <div>
        <form onSubmit={onSubmit}>
            <label>Enter your index</label>
            <input value={index} onChange={e=>setIndex(e.target.value)} type="text" />
            <button>Submit</button>
        </form>
        <h3>All indices that I've seen</h3>
        {renderIndexes()}
        <h3>Calculated values</h3>
        {renderCalculatedValues()}
    </div>
  )
}

export default Fib;