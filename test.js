function parseComponent(componentCode) {
    // Create a sandbox environment to safely execute the code
    const sandbox = new Worker('sandbox.js');
    sandbox.onmessage = (event) => {
      const jsonStructure = event.data;
      // Process the JSON structure as needed
      console.log("Mesg is ",jsonStructure);
    };
  
    // Send the component code to the sandbox
    sandbox.postMessage(componentCode);
  }
  
  // Usage:
  const componentCode = `
  import { Button } from "@/components/button";
  
  export function Component() {
    return (
      <div className="w-full h-full" id="ROOT">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
        <Button>Button 4</Button>
      </div>
    );
  }
  `;