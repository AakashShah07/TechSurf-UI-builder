import { CopyBlock, dracula } from 'react-code-blocks';
import React from 'react';
import { Button } from "./ui/button";

// Function to transform JSX to JSON
function convertJsxToJson(jsxString) {
  function parseElement(elementString) {
    const tagMatch = elementString.match(/^<(\w+)([^>]*)>([\s\S]*)<\/\1>$/);
    if (!tagMatch) return null; // Not a valid element

    const tagName = tagMatch[1];
    const attributesString = tagMatch[2];
    const childrenString = tagMatch[3];

    // Extract attributes
    const attributes = {};
    const attrMatches = [...attributesString.matchAll(/(\w+)="([^"]*)"/g)];
    attrMatches.forEach(match => {
      attributes[match[1]] = match[2];
    });

    // Parse children
    const children = [];
    let remainingString = childrenString;

    // Loop to parse all children elements
    while (remainingString) {
      const childMatch = remainingString.match(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/);
      if (childMatch) {
        const childJson = parseElement(childMatch[0]);
        if (childJson) {
          children.push(childJson);
          remainingString = remainingString.replace(childMatch[0], '').trim();
        }
      } else {
        // Capture text nodes or unrecognized tags
        const textMatch = remainingString.match(/([^<]+)(<.*>)/);
        if (textMatch) {
          const textContent = textMatch[1].trim();
          if (textContent) {
            children.push({ text: textContent });
          }
          remainingString = textMatch[2].trim();
        } else {
          break; // No more recognizable elements
        }
      }
    }

    return {
      tag: tagName,
      attributes,
      children
    };
  }

  // Main parsing logic
  const mainDivMatch = jsxString.match(/<div([^>]*)>([\s\S]*)<\/div>/);
  if (!mainDivMatch) return null; // No main div found

  // Parse main div
  const jsonStructure = {
    div: parseElement(mainDivMatch[0])
  };

  return jsonStructure;
}

// Function to send data to the backend
async function sendDataToBackend(data) {
  try {
    const response = await fetch('http://localhost:3000/visual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Response from backend:', responseData);
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
}

export const CodeView = ({ codeString }: { codeString?: any }) => {
  const code = codeString
    ? codeString
    : `
    import React from "react";\n\nconst Card = () => {\n  return (\n    <div className="max-w-sm rounded overflow-hidden shadow-lg">\n      <h1>Example Card</h1>\n      <p>This is a simple card component.</p>\n    </div>\n  );\n};\n\nexport default Card
    `;

  // Transform JSX to JSON
  const jsonOutput = convertJsxToJson(code);

  // Prepare the data to be sent to the backend
  const dataToSend = {
    title: "My first page",
    page_name: "New one",
    layout_json: JSON.stringify(jsonOutput) // Convert jsonOutput to string
  };

  // Send data to the backend
  sendDataToBackend(dataToSend);

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
