import { useState } from "react";

const CompleteTaskPanel = ({ task, onConfirm, onCancel }) => {
    const [actualDuration, setActualDuration] = useState(task.duration);

    return (
        <div>
            <p>Planned: <strong>{task.duration} min</strong></p>
            <label>
                Actual time spent:
                <input 
                    type="number" 
                    value={actualDuration}
                    min={1}
                    onChange={(e) => setActualDuration(Number(e.target.value))}
                />
                min
            </label>
            <div>
                <button onClick={() => onConfirm(actualDuration)}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CompleteTaskPanel;