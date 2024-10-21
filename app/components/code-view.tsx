import { CopyBlock, dracula } from 'react-code-blocks';
import React from 'react';
import { Button } from "./ui/button";

// Function to transform JSX to JSON
function transformToJSON(componentTree: any) {
  const jsonResult = { components: [] as any[] };

  // Recursive function to traverse the component tree
  function traverse(node: any, positionX = 1, positionY = 1) {
    console.log("Node type is ", typeof node);
    console.log("Node value is ", node.props);

    if (!node || typeof node === "string" || typeof node === "number") {
      // Skip non-component elements (like strings or numbers)
      return;
    }
  
    // Check if the node is a string (for intrinsic HTML elements like 'div')
    let type = node.type;
    if (typeof type === 'string') {
      // It's a regular HTML element
      type = node.type;
    } else if (typeof type === 'function') {
      // It's a React component (like Button)
      type = node.type.displayName || node.type.name || "UnknownComponent funtion";
    } else {
      // Handle if type is not recognized (fallback)
      console.log("Children value is ", node.props.children);

      type = node.props.children;
    }
  
    const content_id = `entry_uid_${positionX}`; // Create unique content IDs
    const styles = node.props && node.props.className ? node.props.className.split(" ") : [];
  
    jsonResult.components.push({
      type,
      position: { x: positionX, y: positionY },
      styles,
      content_id,
    });
  
    // Traverse children if present
    if (node.props && node.props.children) {
      React.Children.forEach(node.props.children, (child, index) => {
        traverse(child, positionX + index + 1, positionY);
      });
    }
  }
  
  

  traverse(componentTree);
  return jsonResult;
}

export const CodeView = ({ codeString }: { codeString?: any }) => {
  const code = codeString
    ? codeString
    : // Placeholder code
      `
    import React from "react";\n\nconst Card = () => {\n  // Dummy data for the card\n  const title = "Example Card";\n  const description = "This is a simple card component in React with Tailwind CSS.";\n  const imageUrl = "https://example.com/example-image.jpg";\n\n  return (\n    <div className="max-w-sm rounded overflow-hidden shadow-lg">\n      <img className="w-full" src={imageUrl} alt={title} />\n      <div className="px-6 py-4">\n        <div className="font-bold text-xl mb-2">{title}</div>\n 
    <div className="font-bold text-xl mb-2">{title}</div>\n 
    <div className="font-bold text-xl mb-2">{title}</div>\n  
    <div className="font-bold text-xl mb-2">{title}</div>\n 
    
    <p className="text-gray-700 text-base">{description}</p>\n      </div>\n    </div>\n  );\n};\n\nexport default Card
    `;

    function modifyCode(codeString: undefined) {
      // Step 1: Identify the part of the string you want to replace
      const oldButton = `<Button>Button 4</Button>`;
      
      // Step 2: Define the new button with the className and new label
      const newButton = `<Button className="rounded-full">Button 5</Button>`;
      
      // Step 3: Replace the old button with the new button in the string
      const modifiedCode = codeString.replace(oldButton, newButton);
      
      // Step 4: Remove the import and function definitions to only return the div part
      const finalCode = modifiedCode
        .replace(/import[^;]*;/, '') // Remove the import statement
        .replace(/export function Component\(\) {/, '') // Remove the function start
        .replace(/\breturn\b\s*/, '') // Remove the 'return' keyword
        .replace(/}$/g, ''); // Remove the closing bracket at the end
      
      return finalCode.trim(); // Return the final result without extra spaces
    }
  // Example of JSX component tree to transform
  const componentTree = (
    <div className="w-full h-full" id="ROOT">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Button className="rounded-full">Button 5</Button>
    </div>
  );

  function modifyCodeToSingleLine(codeString: any) {
    // Step 1: Remove newlines and extra spaces to make it a single-line string
    const singleLineCode = codeString
      .replace(/\s+/g, ' ')   // Replace multiple spaces/newlines with a single space
      .replace(/>\s+</g, '><') // Remove spaces between JSX tags
      .trim();                 // Trim any leading/trailing spaces
    
    // Step 2: Return the single-line string
    return singleLineCode;
  }
  // console.log("Code string is ", codeString)

  // Transform JSX tree to JSON
  const chnageForm = modifyCodeToSingleLine(codeString);
  const jsonOutput = transformToJSON(componentTree);
  console.log("Json outPut is ", modifyCode(chnageForm))
  console.log("Component is ", componentTree)
  // // Log the JSON result
  console.log("Transformed JSON:", JSON.stringify(jsonOutput, null, 2));

  return (
    <div className="rounded-md h-full border border-input">
      <CopyBlock
        customStyle={{ height: '100%', overflow: 'scroll' }}
        text={code}
        language={'typescript'}
        theme={dracula}
      />
    </div>
  );
};
