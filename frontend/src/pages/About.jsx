import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
  >
    <PageTransition>
      <h1 style={{ color: 'black' }}>About the Project</h1>
      <p style={{ color: 'black' }}>This lab uses AI and 3D tech to teach physics interactively.</p>
    </PageTransition>
  </motion.div>
);

export default About;
