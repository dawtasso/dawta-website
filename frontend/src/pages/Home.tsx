import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/client';

export default function Home() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-medium mb-8 tracking-tight">Projects</h1>
      
      {isLoading && (
        <p className="text-gray-600">Loading projects...</p>
      )}
      
      {error && (
        <div className="text-red-600">
          <p className="font-medium mb-2">Error loading projects</p>
          <p className="text-sm">{error.message}</p>
          <p className="text-sm mt-2 text-gray-500">
            Make sure the backend is running: <code className="bg-gray-100 px-1 rounded">make start-backend</code>
          </p>
        </div>
      )}
      
      {projects && (
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <h2 className="text-xl font-medium mb-2">{project.name}</h2>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

