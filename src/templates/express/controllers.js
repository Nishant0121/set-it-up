export const getController = (isTypescript) => {
  const importStatement = isTypescript ? "import { Request, Response } from 'express';\n" : "";
  return `${importStatement}
export const getExample = (req${isTypescript ? ': Request' : ''}, res${isTypescript ? ': Response' : ''}) => {
  res.json({ message: 'This is an example controller response' });
};
`;
};

