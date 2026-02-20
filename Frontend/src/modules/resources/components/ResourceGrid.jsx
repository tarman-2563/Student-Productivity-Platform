import ResourceCard from './ResourceCard';

const ResourceGrid = ({ resources, onResourceClick, onRefetch }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
                <ResourceCard
                    key={resource._id}
                    resource={resource}
                    onClick={() => onResourceClick(resource)}
                    onUpdate={onRefetch}
                />
            ))}
        </div>
    );
};

export default ResourceGrid;
