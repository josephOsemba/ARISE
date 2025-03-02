import { useEffect, useState } from 'react';
import axios from '../api';
import PageTransition from '../components/PageTransition';
import OhmsLawExperiment from '../components/OhmsLawExperiment';

const LabScene = () => {
  const [data, setData] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState('ohmsLaw'); // Default experiment

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/physics-data');
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <PageTransition>
      <div style={{ padding: '20px', color: 'black' }}>
        <h1>Physics Lab</h1>

        {/* Experiment Selection Dropdown */}
        <label>Select Experiment: </label>
        <select
          onChange={(e) => setSelectedExperiment(e.target.value)}
          value={selectedExperiment}
          style={{
            color: 'black',
            background: 'white',
            padding: '5px',
            marginLeft: '10px',
            border: '1px solid black',
            borderRadius: '5px',
          }}
        >
          <option value="ohmsLaw">Ohm&apos;s Law</option>
          {/* Future experiments can be added here */}
        </select>

        {/* Render Selected Experiment */}
        <div style={{ marginTop: '20px' }}>
          {selectedExperiment === 'ohmsLaw' && <OhmsLawExperiment />}
        </div>

        {/* Displaying additional data from backend */}
        <div style={{ marginTop: '30px' }}>
          {data.map((item) => (
            <div key={item.id} style={{ marginBottom: '15px', borderBottom: '1px solid gray' }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default LabScene;
