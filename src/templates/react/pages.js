export const getHome = (options) => {
  const { addShadcn } = options;
  return `import React from 'react';
${addShadcn ? `import { Button } from "@/components/ui/button"` : ''}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Welcome Home 🏠</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md text-center">
        This is the starting point of your amazing application.
      </p>
      
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-white rounded shadow text-green-600 font-bold">✔ React</div>
        <div className="px-4 py-2 bg-white rounded shadow text-blue-600 font-bold">✔ Tailwind</div>
      </div>

      ${addShadcn ? `
      <div className="mt-8">
        <Button onClick={() => alert('Shadcn Button Works!')}>Shadcn Button</Button>
      </div>
      ` : ''}
    </div>
  );
}
`;
};

export const getAbout = () => {
  return `import React from 'react';

export default function About() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">About Us</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        We are building the future with modern web technologies.
      </p>
    </div>
  );
}
`;
};
