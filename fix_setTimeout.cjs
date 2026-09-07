const fs = require('fs');
let code = fs.readFileSync('src/pages/ApplicationFlow.tsx', 'utf8');

// Find the start of the component
const componentStart = code.indexOf('export default function ApplicationFlow() {');
const endOfDecl = code.indexOf('  const [formData, setFormData] = useState({', componentStart);

// Insert the useEffect
const useEffectCode = `
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => {
        setStep(8);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);
`;

code = code.slice(0, endOfDecl) + useEffectCode + '\n' + code.slice(endOfDecl);

// Remove the inline setTimeout
code = code.replace(/{setTimeout\(\(\) => setStep\(8\), 2000\) && null}/g, '');

fs.writeFileSync('src/pages/ApplicationFlow.tsx', code);
