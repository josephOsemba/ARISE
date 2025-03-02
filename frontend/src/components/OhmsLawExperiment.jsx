import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Helper Function to Check if Objects are Close
const isNear = (obj1, obj2, threshold = 1.5) => {
  return obj1.distanceTo(obj2) < threshold;
};

const OhmsLawExperiment = () => {
  const mountRef = useRef(null);
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(10);
  const [current, setCurrent] = useState(0);
  const [isCircuitComplete, setIsCircuitComplete] = useState(false);

  // Store positions for drag logic
  const positions = useRef({
    battery: new THREE.Vector3(-3, 0, 0),
    resistor: new THREE.Vector3(3, 0, 0),
    wire1: new THREE.Vector3(-1, 1, 0),
    wire2: new THREE.Vector3(1, -1, 0),
  });

  useEffect(() => {
    const mountElement = mountRef.current; // Store ref to avoid cleanup issues
    if (!mountElement) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    mountElement.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Function to Create Draggable Objects
    const createDraggable = (geometry, material, position, name) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.name = name;
      scene.add(mesh);
      return mesh;
    };

    // Components
    const battery = createDraggable(
      new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
      new THREE.MeshStandardMaterial({ color: 0xff0000 }),
      positions.current.battery,
      "battery"
    );

    const resistor = createDraggable(
      new THREE.BoxGeometry(1, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xffff00 }),
      positions.current.resistor,
      "resistor"
    );

    const wire1 = createDraggable(
      new THREE.CylinderGeometry(0.1, 0.1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa }),
      positions.current.wire1,
      "wire1"
    );

    const wire2 = createDraggable(
      new THREE.CylinderGeometry(0.1, 0.1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa }),
      positions.current.wire2,
      "wire2"
    );

    // Lights
    scene.add(new THREE.AmbientLight(0x404040));
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 5, 5);
    scene.add(light);

    camera.position.z = 5;

    // Dragging Logic
    let selectedObject = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([battery, resistor, wire1, wire2]);
      if (intersects.length > 0) {
        selectedObject = intersects[0].object;
      }
    };

    const onMouseMove = (event) => {
      if (!selectedObject) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const point = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, point);
      selectedObject.position.copy(point);
    };

    const onMouseUp = () => {
      if (selectedObject) {
        positions.current[selectedObject.name] = selectedObject.position.clone();
        selectedObject = null;
        checkCircuit();
      }
    };

    mountElement.addEventListener("mousedown", onMouseDown);
    mountElement.addEventListener("mousemove", onMouseMove);
    mountElement.addEventListener("mouseup", onMouseUp);

    // Check if Circuit is Complete
    const checkCircuit = () => {
      const { battery, resistor, wire1, wire2 } = positions.current;
      if (isNear(battery, wire1) && isNear(wire1, resistor) && isNear(resistor, wire2) && isNear(wire2, battery)) {
        setIsCircuitComplete(true);
        setCurrent(voltage / resistance);
        wire1.material.color.set(0x00ffff);
        wire2.material.color.set(0x00ffff);
      } else {
        setIsCircuitComplete(false);
        setCurrent(0);
        wire1.material.color.set(0xaaaaaa);
        wire2.material.color.set(0xaaaaaa);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on Unmount
    return () => {
      if (mountElement) {
        mountElement.removeEventListener("mousedown", onMouseDown);
        mountElement.removeEventListener("mousemove", onMouseMove);
        mountElement.removeEventListener("mouseup", onMouseUp);
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [voltage, resistance]);

  return (
    <div style={{ textAlign: "center", color: "#fff", background: "#222", padding: "10px" }}>
      <h2>Ohm&apos;s Law Experiment</h2>
      <div ref={mountRef} style={{ width: "80vw", height: "80vh", margin: "auto", border: "2px solid white" }} />

      <div style={{ marginTop: "10px", padding: "10px", background: "rgba(0,0,0,0.8)" }}>
        <button onClick={() => setIsCircuitComplete(!isCircuitComplete)}>
          {isCircuitComplete ? "Disconnect Circuit" : "Connect Circuit"}
        </button>
        <br /><br />
        <label>
          Voltage (V):
          <input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} disabled={!isCircuitComplete} />
        </label>
        <br />
        <label>
          Resistance (Ω):
          <input type="number" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} disabled={!isCircuitComplete} />
        </label>
        <br />
        <h3>Current (I): {isCircuitComplete ? current.toFixed(2) : "0"} A</h3>
        {isCircuitComplete ? <p style={{ color: "lime" }}>Circuit Complete ✅</p> : <p style={{ color: "red" }}>Incomplete Circuit ❌</p>}
      </div>
    </div>
  );
};

export default OhmsLawExperiment;
