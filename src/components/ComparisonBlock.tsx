import React from 'react';
import CodeBlock from './CodeBlock';

interface ComparisonBlockProps {
  title: string;
  description: string | React.ReactNode;
  traditionalCode: string;
  queryCode: string;
  benefits?: string[];
}

const ComparisonBlock: React.FC<ComparisonBlockProps> = ({
  title,
  description,
  traditionalCode,
  queryCode,
  benefits = [],
}) => {
  return (
    <section className="my-10 rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="mb-6">{description}</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3 text-muted-foreground">Traditional Approach</h3>
          <CodeBlock 
            code={traditionalCode} 
            title="useState + useEffect"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3 text-primary">TanStack Query Approach</h3>
          <CodeBlock 
            code={queryCode} 
            title="useQuery"
          />
        </div>
      </div>
      
      {benefits.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
          <ul className="list-disc list-inside space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-muted-foreground">{benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ComparisonBlock;